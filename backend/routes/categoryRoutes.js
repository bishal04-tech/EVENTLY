import express from 'express';
import { getCategories, createCategory } from '../controllers/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

// Maps HTTP method operations smoothly to your fresh controllers layer
router.route('/')
  .get(getCategories)
  .post(createCategory);

export default router;