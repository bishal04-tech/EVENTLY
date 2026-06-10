import express from 'express';
// 1. Import ALL of your controller methods
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
  .post(createEvent);

// 3. Trending Route (Handles: GET /api/events/trending)
// NOTE: Place this ABOVE the /:id route so Express doesn't mistake the word "trending" for an ID!
router.route('/trending')
  .get(getTrendingEvents);

// 4. Individual Record Routes (Handles: GET, PATCH, and DELETE for /api/events/:id)
router.route('/:id')
  .get(getEventById)
  .patch(updateEvent)
  .delete(deleteEvent);

// 5. Related Items Route (Handles: GET /api/events/:id/related)
router.route('/:id/related')
  .get(getRelatedEvents);

export default router;