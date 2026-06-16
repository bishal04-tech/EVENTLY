// import express from 'express';
// import { register, login } from '../controllers/authController.js';

// const router = express.Router();

// // Route for creating a new account 
// router.post('/register', register);

// // Route for signing into an account 
// router.post('/login', login);

// export default router;

import express from 'express';
import { register, login } from '../controllers/authController.js';
import {
  loginLimiter,
  registerLimiter,
} from '../middleware/rateLimiter.js';

const router = express.Router();

// Route for creating a new account
router.post('/register', registerLimiter, register);

// Route for signing into an account
router.post('/login', loginLimiter, login);

export default router;