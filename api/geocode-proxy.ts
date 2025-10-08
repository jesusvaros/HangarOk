// Types for Vercel serverless functions
interface VercelRequest {
  method?: string;
  body: any;
  query: { [key: string]: string | string[] };
  headers: { [key: string]: string };
}

interface VercelResponse {
  status(code: number): VercelResponse;
  json(data: any): void;
}

interface UsageRecord {
  date: string;
  count: number;
  cost: number;
}

// In production, use a database instead of memory
let dailyUsage: Map<string, UsageRecord> = new Map();

const DAILY_LIMIT = 1000; // Adjust based on your budget
const MONTHLY_LIMIT = 25000; // Adjust based on your budget
const COST_PER_REQUEST = 0.0005; // €0.50 per 1000 requests
const MAX_DAILY_COST = 0.50; // €0.50 per day max
const MAX_MONTHLY_COST = 12.50; // €12.50 per month max

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

function getMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getUsage(period: 'daily' | 'monthly'): UsageRecord {
  const key = period === 'daily' ? getTodayKey() : getMonthKey();
  return dailyUsage.get(key) || { date: key, count: 0, cost: 0 };
}

function incrementUsage(period: 'daily' | 'monthly'): void {
  const key = period === 'daily' ? getTodayKey() : getMonthKey();
  const current = getUsage(period);
  const updated = {
    date: key,
    count: current.count + 1,
    cost: current.cost + COST_PER_REQUEST
  };
  dailyUsage.set(key, updated);
}

function canMakeRequest(): { allowed: boolean; reason?: string; usage: any } {
  const dailyUsage = getUsage('daily');
  const monthlyUsage = getUsage('monthly');

  // Check daily limits
  if (dailyUsage.count >= DAILY_LIMIT) {
    return {
      allowed: false,
      reason: `Daily request limit exceeded (${DAILY_LIMIT})`,
      usage: { daily: dailyUsage, monthly: monthlyUsage }
    };
  }

  if (dailyUsage.cost >= MAX_DAILY_COST) {
    return {
      allowed: false,
      reason: `Daily cost limit exceeded (€${MAX_DAILY_COST})`,
      usage: { daily: dailyUsage, monthly: monthlyUsage }
    };
  }

  // Check monthly limits
  if (monthlyUsage.count >= MONTHLY_LIMIT) {
    return {
      allowed: false,
      reason: `Monthly request limit exceeded (${MONTHLY_LIMIT})`,
      usage: { daily: dailyUsage, monthly: monthlyUsage }
    };
  }

  if (monthlyUsage.cost >= MAX_MONTHLY_COST) {
    return {
      allowed: false,
      reason: `Monthly cost limit exceeded (€${MAX_MONTHLY_COST})`,
      usage: { daily: dailyUsage, monthly: monthlyUsage }
    };
  }

  return {
    allowed: true,
    usage: { daily: dailyUsage, monthly: monthlyUsage }
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check usage limits before making request
  const { allowed, reason, usage } = canMakeRequest();
  
  if (!allowed) {
    console.warn(`HERE API request blocked: ${reason}`, usage);
    return res.status(429).json({
      error: 'Usage limit exceeded',
      reason,
      usage,
      fallback: true // Signal to client to use fallback
    });
  }

  try {
    const { endpoint, params } = req.body;
    
    if (!endpoint || !params) {
      return res.status(400).json({ error: 'Missing endpoint or params' });
    }

    // Try both server-side and Vite environment variables
    const apiKey = process.env.HERE_API_KEY || process.env.VITE_HERE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'HERE API key not configured (set HERE_API_KEY or VITE_HERE_API_KEY)' });
    }

    // Construct the HERE API URL based on endpoint
    let url: string;
    switch (endpoint) {
      case 'geocode':
        url = `https://geocode.search.hereapi.com/v1/geocode?${new URLSearchParams({
          ...params,
          apiKey
        })}`;
        break;
      case 'revgeocode':
        url = `https://revgeocode.search.hereapi.com/v1/revgeocode?${new URLSearchParams({
          ...params,
          apiKey
        })}`;
        break;
      default:
        return res.status(400).json({ error: 'Invalid endpoint' });
    }

    // Make the request to HERE API
    const response = await fetch(url);
    const data = await response.json();

    // If successful, increment usage counters
    if (response.ok) {
      incrementUsage('daily');
      incrementUsage('monthly');
      
      // Log usage for monitoring
      const updatedUsage = {
        daily: getUsage('daily'),
        monthly: getUsage('monthly')
      };
      
      // Alert only when approaching limits (80% threshold)
      if (updatedUsage.daily.count > DAILY_LIMIT * 0.8) {
        console.warn(`⚠️ Daily HERE API usage high: ${updatedUsage.daily.count}/${DAILY_LIMIT} (${(updatedUsage.daily.count/DAILY_LIMIT*100).toFixed(1)}%)`);
      }
      
      if (updatedUsage.monthly.count > MONTHLY_LIMIT * 0.8) {
        console.warn(`⚠️ Monthly HERE API usage high: ${updatedUsage.monthly.count}/${MONTHLY_LIMIT} (${(updatedUsage.monthly.count/MONTHLY_LIMIT*100).toFixed(1)}%)`);
      }
    }

    // Return the HERE API response
    res.status(response.status).json(data);

  } catch (error) {
    console.error('HERE API proxy error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      fallback: true // Signal to client to use fallback
    });
  }
}
