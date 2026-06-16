// controllers/metricsController.js
import { getLogsData } from '../middleware/metrics.js';

export const getSystemMetrics = (req, res) => {
  try {
    // 1. Grab the live data collected by the middleware
    const requestLogs = getLogsData();

    // 2. Format the data for the Recharts line graph (last 6 requests)
    const historyLogs = requestLogs.slice(0, 6).reverse(); 
    const history = historyLogs.map((log) => {
      const date = new Date(log.timestamp);
      return {
        time: `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`,
        avgTime: log.duration
      };
    });

    // Fallback if there are no logs yet
    const safeHistory = history.length > 0 ? history : [{ time: "Now", avgTime: 0 }];

    // 3. Send it to the React Dashboard
    res.status(200).json({
      history: safeHistory,
      logs: requestLogs.slice(0, 15) // Send top 15 rows to the table
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate metrics' });
  }
};