
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose'; // 1. Imported Mongoose to handle the MongoDB connection
import eventRoutes from './routes/eventRoutes.js'; // Importing the event routes
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import { getSystemMetrics } from './controllers/metricsController.js'; // Import the new metrics controller
import { metricsTracker } from './middleware/metrics.js'; // Import the new metrics middleware
import { redis } from './config/redis.js';
import { injectRedis } from './middleware/redisMiddleware.js'
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// 2. Connect to MongoDB Atlas using your environment variable
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Database Connected Successfully!'))
  .catch((err) => console.error('❌ Database Connection Error:', err));



// Middleware
app.use(cors());
app.use(express.json()); // Allows the server to accept JSON data in requests
app.set('trust proxy', 1);
app.use(injectRedis);
app.use(metricsTracker);

// 3. ⚡ ADD THE METRICS ENDPOINT
app.get('/api/metrics', getSystemMetrics);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);
// Basic Test Route
app.get('/', (req, res) => {
  res.send('Server is up and running smoothly!');
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});