import express from 'express';
import { getSystemMetrics } from '../controllers/metricsController.js'; // Adjust path if needed

const router = express.Router();

// This handles the GET request to /api/metrics
router.get('/', getSystemMetrics);

export default router;