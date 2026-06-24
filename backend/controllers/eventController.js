
import Event from '../models/events.js';
import Order from '../models/Order.js'; 
import Category from '../models/Category.js'; 

// Helper to format rows cleanly matching your original UI expectations
function buildEventRow(event, categoryName = null, ticketsSold = 0) {
  return {
    id: event._id, 
    title: event.title,
    description: event.description || null,
    imageUrl: event.imageUrl || null,
    location: event.location,
    startDate: event.startDate ? new Date(event.startDate).toISOString() : null,
    endDate: event.endDate ? new Date(event.endDate).toISOString() : null,
    price: event.price || null,
    isFree: event.isFree ?? false,
    url: event.url || null,
    categoryId: event.categoryId,
    organizerName: event.organizerName || null,
    createdAt: event.createdAt ? new Date(event.createdAt).toISOString() : null,
    categoryName: categoryName || null,
    ticketsSold: ticketsSold || 0,
  };
}

// Helper utility to safely invalidate all keys linked to event lists
async function clearEventsCache(redis) {
  try {
    // Find all cache keys that match our event namespace pattern
    const keys = await redis.keys('cache:events:*');
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`Summary: Cleared ${keys.length} event cache keys due to database alteration`);
    }
  } catch (err) {
    console.error('Failed to sweep Redis event cache keys:', err);
  }
}

// @desc    Get all events with Text Search, Category filters, and Pagination
// @route   GET /api/events
export const getEvents = async (req, res) => {
  try {
    const { redis } = req;
    const { search = '', categoryId = '', limit = 20, offset = 0 } = req.query;

    // Generate a unique cache key based on query filters to avoid data leakage across requests
    const cacheKey = `cache:events:all:s_${search}:c_${categoryId}:l_${limit}:o_${offset}`;
    
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log('Serving paginated events from Upstash Redis');
      return res.json(JSON.parse(cachedData));
    }

    let queryFilter = {};
    if (search) {
      queryFilter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (categoryId) {
      queryFilter.categoryId = Number(categoryId);
    }

    console.time("eventsQuery");
    const allEvents = await Event.find(queryFilter).sort({ startDate: 1 }).lean();
    console.timeEnd("eventsQuery");

    const total = allEvents.length;
    const slicedEvents = allEvents.slice(Number(offset), Number(offset) + Number(limit));

    const formattedEvents = await Promise.all(
      slicedEvents.map(async (e) => {
        const categoryDoc = await Category.findOne({ categoryId: e.categoryId }).lean();
        const orders = await Order.find({ eventId: e._id }).lean();
        const totalTickets = orders.reduce((sum, order) => sum + (order.quantity || 0), 0);
        return buildEventRow(e, categoryDoc ? categoryDoc.name : null, totalTickets);
      })
    );

    const responsePayload = { events: formattedEvents, total };

    // Cache the query structure for 5 minutes (300s) to keep high-speed pagination snappy
    await redis.set(cacheKey, JSON.stringify(responsePayload), 'EX', 300);

    return res.json(responsePayload);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
export const createEvent = async (req, res) => {
  try {
    const { redis } = req;
    const { startDate, endDate, ...rest } = req.body;

    // Direct drop-in: Check if Multer intercepted an uploaded file and assigned a Cloudinary link
    const imageUrl = req.file ? req.file.path : (rest.imageUrl || '');

    const event = await Event.create({
      ...rest,
      imageUrl, // Plug the Cloudinary link straight into your pristine model format
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      user: req.user.id 
    });

    const categoryDoc = await Category.findOne({ categoryId: event.categoryId }).lean();

    // Invalidate caches to show the new event on dashboards instantly
    await clearEventsCache(redis);

    return res.status(201).json(buildEventRow(event.toObject(), categoryDoc ? categoryDoc.name : null, 0));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// @desc    Get trending events based on ticket sales quantity
// @route   GET /api/events/trending
export const getTrendingEvents = async (req, res) => {
  try {
    const { redis } = req;
    const cacheKey = 'cache:events:trending';

    const cachedTrending = await redis.get(cacheKey);
    if (cachedTrending) {
      console.log('Serving trending events from Upstash Redis');
      return res.json(JSON.parse(cachedTrending));
    }

    const topOrders = await Order.aggregate([
      { $group: { _id: "$eventId", ticketsSold: { $sum: "$quantity" } } },
      { $sort: { ticketsSold: -1 } },
      { $limit: 6 }
    ]);

    if (topOrders.length === 0) {
      const recent = await Event.find().sort({ createdAt: 1 }).limit(6).lean();
      
      const formattedRecent = await Promise.all(
        recent.map(async (e) => {
          const categoryDoc = await Category.findOne({ categoryId: e.categoryId }).lean();
          return buildEventRow(e, categoryDoc ? categoryDoc.name : null, 0);
        })
      );

      await redis.set(cacheKey, JSON.stringify(formattedRecent), 'EX', 600); // Cache for 10 mins
      return res.json(formattedRecent);
    }

    const trendingEvents = await Promise.all(
      topOrders.map(async (item) => {
        const eventDoc = await Event.findById(item._id).lean();
        if (!eventDoc) return null;
        const categoryDoc = await Category.findOne({ categoryId: eventDoc.categoryId }).lean();
        return buildEventRow(eventDoc, categoryDoc ? categoryDoc.name : null, item.ticketsSold);
      })
    );

    const result = trendingEvents.filter(e => e !== null);
    await redis.set(cacheKey, JSON.stringify(result), 'EX', 600);

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// @desc    Get a single event by ID
// @route   GET /api/events/:id
export const getEventById = async (req, res) => {
  try {
    const { redis } = req;
    const cacheKey = `cache:events:single:${req.params.id}`;

    const cachedEvent = await redis.get(cacheKey);
    if (cachedEvent) {
      console.log(`Serving event details for ID ${req.params.id} from Upstash Redis`);
      return res.json(JSON.parse(cachedEvent));
    }

    const row = await Event.findById(req.params.id).lean();
    if (!row) {
      return res.status(404).json({ error: "Event not found" });
    }

    const categoryDoc = await Category.findOne({ categoryId: row.categoryId }).lean();
    const orders = await Order.find({ eventId: row._id }).lean();
    const totalTickets = orders.reduce((sum, order) => sum + (order.quantity || 0), 0);

    const formattedEvent = buildEventRow(row, categoryDoc ? categoryDoc.name : null, totalTickets);
    
    await redis.set(cacheKey, JSON.stringify(formattedEvent), 'EX', 1800); // Cache individual event for 30 mins

    return res.json(formattedEvent);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// @desc    Update an event field properties path natively
// @route   PATCH /api/events/:id
// @access  Private
export const updateEvent = async (req, res) => {
  try {
    const { redis } = req;
    const { startDate, endDate, ...rest } = req.body;
    
    const existingEvent = await Event.findById(req.params.id);
    if (!existingEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (!existingEvent.user || existingEvent.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "User not authorized to update this event" });
    }

    const updateData = { ...rest };
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    
    // Direct drop-in: Update imageUrl configuration only if a new file path is coming through Multer
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    ).lean();

    const categoryDoc = await Category.findOne({ categoryId: event.categoryId }).lean();
    const orders = await Order.find({ eventId: event._id }).lean();
    const totalTickets = orders.reduce((sum, order) => sum + (order.quantity || 0), 0);

    const updatedFormattedEvent = buildEventRow(event, categoryDoc ? categoryDoc.name : null, totalTickets);

    // Evict list aggregations and specific details cache to flush out stale values
    await clearEventsCache(redis);
    await redis.del(`cache:events:single:${req.params.id}`);

    return res.json(updatedFormattedEvent);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// @desc    Delete an event document file securely
// @route   DELETE /api/events/:id
// @access  Private
export const deleteEvent = async (req, res) => {
  try {
    const { redis } = req;
    const existingEvent = await Event.findById(req.params.id);
    if (!existingEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (!existingEvent.user || existingEvent.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "User not authorized to delete this event" });
    }

    await Event.findByIdAndDelete(req.params.id);

    // Evict all dependent caches
    await clearEventsCache(redis);
    await redis.del(`cache:events:single:${req.params.id}`);

    return res.sendStatus(204); 
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// @desc    List related events inside matching category scopes, excluding source file
// @route   GET /api/events/:id/related
export const getRelatedEvents = async (req, res) => {
  try {
    const { redis } = req;
    const cacheKey = `cache:events:related:${req.params.id}`;

    const cachedRelated = await redis.get(cacheKey);
    if (cachedRelated) {
      console.log(`Serving related events for ID ${req.params.id} from Upstash Redis`);
      return res.json(JSON.parse(cachedRelated));
    }

    const sourceEvent = await Event.findById(req.params.id).lean();
    if (!sourceEvent) {
      return res.json([]);
    }

    const related = await Event.find({
      categoryId: sourceEvent.categoryId,
      _id: { $ne: sourceEvent._id }
    }).limit(4).lean();

    const formattedRelated = await Promise.all(
      related.map(async (e) => {
        const categoryDoc = await Category.findOne({ categoryId: e.categoryId }).lean();
        return buildEventRow(e, categoryDoc ? categoryDoc.name : null, 0);
      })
    );

    await redis.set(cacheKey, JSON.stringify(formattedRelated), 'EX', 1800);

    return res.json(formattedRelated);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};