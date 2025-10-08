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
// This is shared with geocode-proxy.ts (in production, use Redis/DB)
let dailyUsage: Map<string, UsageRecord> = new Map();

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const dailyUsage = getUsage('daily');
    const monthlyUsage = getUsage('monthly');

    const limits = {
      daily: {
        requests: parseInt(process.env.HERE_DAILY_REQUEST_LIMIT || '1000'),
        cost: parseFloat(process.env.HERE_MAX_DAILY_COST || '0.50')
      },
      monthly: {
        requests: parseInt(process.env.HERE_MONTHLY_REQUEST_LIMIT || '25000'),
        cost: parseFloat(process.env.HERE_MAX_MONTHLY_COST || '12.50')
      }
    };

    const stats = {
      usage: {
        daily: dailyUsage,
        monthly: monthlyUsage
      },
      limits,
      percentages: {
        daily: {
          requests: (dailyUsage.count / limits.daily.requests) * 100,
          cost: (dailyUsage.cost / limits.daily.cost) * 100
        },
        monthly: {
          requests: (monthlyUsage.count / limits.monthly.requests) * 100,
          cost: (monthlyUsage.cost / limits.monthly.cost) * 100
        }
      },
      alerts: {
        dailyWarning: dailyUsage.count > limits.daily.requests * 0.8,
        monthlyWarning: monthlyUsage.count > limits.monthly.requests * 0.8,
        dailyCritical: dailyUsage.count > limits.daily.requests * 0.95,
        monthlyCritical: monthlyUsage.count > limits.monthly.requests * 0.95
      }
    };

    res.status(200).json(stats);

  } catch (error) {
    console.error('Usage stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
