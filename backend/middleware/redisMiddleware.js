// middleware/redisMiddleware.js
import { redis } from '../config/redis.js';

export const injectRedis = (req, res, next) => {
  // Attach the redis instance to the request object
  req.redis = redis;
  next(); // Pass control to the next middleware/controller
};