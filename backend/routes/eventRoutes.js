// import express from 'express';
// // 1. Import ALL of your controller methods
// import { protect } from '../middleware/authMiddleware.js';
// import {
//   getEvents,
//   createEvent,
//   getTrendingEvents,
//   getEventById,
//   updateEvent,
//   deleteEvent,
//   getRelatedEvents
// } from '../controllers/eventController.js';

// const router = express.Router();

// // 2. Base Collection Routes (Handles: GET /api/events & POST /api/events)
// router.route('/')
//   .get(getEvents)
//   .post(protect,createEvent);

// // 3. Trending Route (Handles: GET /api/events/trending)
// // NOTE: Place this ABOVE the /:id route so Express doesn't mistake the word "trending" for an ID!
// router.route('/trending')
//   .get(getTrendingEvents);

// // 4. Individual Record Routes (Handles: GET, PATCH, and DELETE for /api/events/:id)
// router.route('/:id')
//   .get(getEventById)
//   .patch(protect,updateEvent)
//   .delete(protect,deleteEvent);

// // 5. Related Items Route (Handles: GET /api/events/:id/related)
// router.route('/:id/related')
//   .get(getRelatedEvents);

// export default router;

import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js'; // 1. Import your clean Multer configuration middleware
import {
  getEvents,
  createEvent,
  getTrendingEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getRelatedEvents
} from '../controllers/eventController.js';

const router = express.Router();

// 2. Base Collection Routes (Handles: GET /api/events & POST /api/events)
router.route('/')
  .get(getEvents)
  .post(protect, upload.single('imageUrl'), createEvent); // Added upload.single here

// 3. Trending Route (Handles: GET /api/events/trending)
router.route('/trending')
  .get(getTrendingEvents);

// 4. Individual Record Routes (Handles: GET, PATCH, and DELETE for /api/events/:id)
router.route('/:id')
  .get(getEventById)
  .patch(protect, upload.single('imageUrl'), updateEvent) // Added upload.single here
  .delete(protect, deleteEvent);

// 5. Related Items Route (Handles: GET /api/events/:id/related)
router.route('/:id/related')
  .get(getRelatedEvents);

export default router;