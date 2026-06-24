import express from 'express';
import { getOrders, createOrder, getOrderById } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Base endpoint grouping: GET /api/orders and POST /api/orders
router.route('/')
  .get(getOrders)
  .post(createOrder);

// Detail endpoint grouping: GET /api/orders/:id
router.route('/:id')
  .get(getOrderById);

export default router;

