// middleware/metrics.js

// This array holds the live data in your server's memory
const requestLogs = [];
const MAX_LOGS = 100; // Limits memory usage to only the last 100 requests

export const metricsTracker = (req, res, next) => {
  // Prevent infinite loops by NOT tracking the metrics endpoint itself
  if (req.originalUrl.startsWith('/api/metrics')) {
    return next();
  }

  // Start the timer
  const start = Date.now();

  // res.on('finish') triggers exactly when the server finishes sending the response
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Attempt to calculate data size, fallback to 0.1 KB if unknown
    const contentLength = res.get('Content-Length');
    const sizeInKb = contentLength ? (parseInt(contentLength) / 1024).toFixed(1) + ' KB' : '0.1 KB';

    // Create the log object
    const logEntry = {
      id: Math.random().toString(36).substring(2, 9),
      method: req.method,
      endpoint: req.originalUrl.split('?')[0], // Strips query params for cleaner UI
      status: res.statusCode,
      duration: duration,
      size: sizeInKb,
      timestamp: new Date().toISOString()
    };

    // Add to the top of the list
    requestLogs.unshift(logEntry);

    // Drop the oldest record if we go over 100
    if (requestLogs.length > MAX_LOGS) {
      requestLogs.pop();
    }
  });

  // Proceed to the next route/controller
  next();
};

// Export a way for the controller to read this data
export const getLogsData = () => requestLogs;