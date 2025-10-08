import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Usage tracking (in-memory for development)
const dailyUsage = new Map();

const DAILY_LIMIT = parseInt(process.env.HERE_DAILY_REQUEST_LIMIT || '1000');
const MONTHLY_LIMIT = parseInt(process.env.HERE_MONTHLY_REQUEST_LIMIT || '25000');
const COST_PER_REQUEST = 0.0005;
const MAX_DAILY_COST = parseFloat(process.env.HERE_MAX_DAILY_COST || '0.50');
const MAX_MONTHLY_COST = parseFloat(process.env.HERE_MAX_MONTHLY_COST || '12.50');

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function getMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getUsage(period) {
  const key = period === 'daily' ? getTodayKey() : getMonthKey();
  return dailyUsage.get(key) || { date: key, count: 0, cost: 0 };
}

function incrementUsage(period) {
  const key = period === 'daily' ? getTodayKey() : getMonthKey();
  const current = getUsage(period);
  const updated = {
    date: key,
    count: current.count + 1,
    cost: current.cost + COST_PER_REQUEST
  };
  dailyUsage.set(key, updated);
}

function canMakeRequest() {
  const daily = getUsage('daily');
  const monthly = getUsage('monthly');

  if (daily.count >= DAILY_LIMIT) {
    return { allowed: false, reason: `Daily request limit exceeded (${DAILY_LIMIT})`, usage: { daily, monthly } };
  }
  if (daily.cost >= MAX_DAILY_COST) {
    return { allowed: false, reason: `Daily cost limit exceeded (€${MAX_DAILY_COST})`, usage: { daily, monthly } };
  }
  if (monthly.count >= MONTHLY_LIMIT) {
    return { allowed: false, reason: `Monthly request limit exceeded (${MONTHLY_LIMIT})`, usage: { daily, monthly } };
  }
  if (monthly.cost >= MAX_MONTHLY_COST) {
    return { allowed: false, reason: `Monthly cost limit exceeded (€${MAX_MONTHLY_COST})`, usage: { daily, monthly } };
  }

  return { allowed: true, usage: { daily, monthly } };
}

// API Routes
app.post('/api/geocode-proxy', async (req, res) => {
  const { allowed, reason, usage } = canMakeRequest();
  
  if (!allowed) {
    console.warn(`HERE API request blocked: ${reason}`);
    return res.status(429).json({
      error: 'Usage limit exceeded',
      reason,
      usage,
      fallback: true
    });
  }

  try {
    const { endpoint, params } = req.body;
    
    if (!endpoint || !params) {
      return res.status(400).json({ error: 'Missing endpoint or params' });
    }

    const apiKey = process.env.HERE_API_KEY || process.env.VITE_HERE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'HERE API key not configured' });
    }

    let url;
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

    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      incrementUsage('daily');
      incrementUsage('monthly');
      
      const updatedUsage = {
        daily: getUsage('daily'),
        monthly: getUsage('monthly')
      };
      
      // Log only warnings when approaching limits
      if (updatedUsage.daily.count > DAILY_LIMIT * 0.8) {
        console.warn(`⚠️ Daily usage high: ${updatedUsage.daily.count}/${DAILY_LIMIT} (${(updatedUsage.daily.count/DAILY_LIMIT*100).toFixed(1)}%)`);
      }
      if (updatedUsage.monthly.count > MONTHLY_LIMIT * 0.8) {
        console.warn(`⚠️ Monthly usage high: ${updatedUsage.monthly.count}/${MONTHLY_LIMIT} (${(updatedUsage.monthly.count/MONTHLY_LIMIT*100).toFixed(1)}%)`);
      }
    }

    res.status(response.status).json(data);

  } catch (error) {
    console.error('HERE API proxy error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      fallback: true
    });
  }
});

app.get('/api/usage-stats', (req, res) => {
  const daily = getUsage('daily');
  const monthly = getUsage('monthly');

  const limits = {
    daily: { requests: DAILY_LIMIT, cost: MAX_DAILY_COST },
    monthly: { requests: MONTHLY_LIMIT, cost: MAX_MONTHLY_COST }
  };

  const stats = {
    usage: { daily, monthly },
    limits,
    percentages: {
      daily: {
        requests: (daily.count / limits.daily.requests) * 100,
        cost: (daily.cost / limits.daily.cost) * 100
      },
      monthly: {
        requests: (monthly.count / limits.monthly.requests) * 100,
        cost: (monthly.cost / limits.monthly.cost) * 100
      }
    },
    alerts: {
      dailyWarning: daily.count > limits.daily.requests * 0.8,
      monthlyWarning: monthly.count > limits.monthly.requests * 0.8,
      dailyCritical: daily.count > limits.daily.requests * 0.95,
      monthlyCritical: monthly.count > limits.monthly.requests * 0.95
    }
  };

  res.json(stats);
});

// Proxy to Vite dev server for everything else
app.use('/', createProxyMiddleware({
  target: 'http://localhost:5175',
  changeOrigin: true,
  ws: true
}));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Development server with HERE API cost control running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   - POST /api/geocode-proxy`);
  console.log(`   - GET /api/usage-stats`);
  console.log(`💰 Limits: ${DAILY_LIMIT} requests/day, €${MAX_DAILY_COST}/day`);
});
