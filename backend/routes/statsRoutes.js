import { Router } from 'express';
import { getDashboardStats, getCategoryStats } from '../controllers/statsController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = Router();

// Dashboard stats endpoint
router.get('/dashboard', getDashboardStats);

// Category stats endpoint
router.get('/categories', getCategoryStats);

export default router;

