
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose'; // 1. Imported Mongoose to handle the MongoDB connection
import eventRoutes from './routes/eventRoutes.js'; // Importing the event routes
import authRoutes from './routes/authRoutes.js';

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

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);



// Basic Test Route
app.get('/', (req, res) => {
  res.send('Server is up and running smoothly!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});