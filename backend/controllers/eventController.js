

import Event from '../models/events.js';
import Order from '../models/Order.js'; // Fully integrated below
import Category from '../models/Category.js'; // Fully integrated below

// Clean Helper Function to format rows matching your original UI expectations
function buildEventRow(event, categoryName = null, ticketsSold = 0) {
  return {
    id: event._id, // Maps MongoDB's _id to 'id' for frontend consistency
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

// @desc    Get all events with Text Search, Category filters, and Pagination
// @route   GET /api/events
export const getEvents = async (req, res) => {
  try {
    const { search, categoryId, limit = 20, offset = 0 } = req.query;
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

    const allEvents = await Event.find(queryFilter).sort({ startDate: 1 }).lean();
    const total = allEvents.length;
    const slicedEvents = allEvents.slice(Number(offset), Number(offset) + Number(limit));

    // DYNAMIC LOOKUP: Fetch real Category names and count quantities from Orders
    const formattedEvents = await Promise.all(
      slicedEvents.map(async (e) => {
        // 1. Find category name matching the categoryId
        const categoryDoc = await Category.findOne({ categoryId: e.categoryId }).lean();
        
        // 2. Aggregate sum of ticket quantities matching this eventId
        const orders = await Order.find({ eventId: e._id }).lean();
        const totalTickets = orders.reduce((sum, order) => sum + (order.quantity || 0), 0);

        return buildEventRow(e, categoryDoc ? categoryDoc.name : null, totalTickets);
      })
    );

    res.json({
      events: formattedEvents,
      total,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Create a new event
// @route   POST /api/events
export const createEvent = async (req, res) => {
  try {
    const { startDate, endDate, ...rest } = req.body;

    const event = await Event.create({
      ...rest,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
    });

    // Lookup category name for the newly created item
    const categoryDoc = await Category.findOne({ categoryId: event.categoryId }).lean();

    res.status(201).json(buildEventRow(event.toObject(), categoryDoc ? categoryDoc.name : null, 0));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Get trending events based on ticket sales quantity
// @route   GET /api/events/trending
export const getTrendingEvents = async (req, res) => {
  try {
    // Use MongoDB aggregation to sum quantities grouped by eventId, ordered highest to lowest
    const topOrders = await Order.aggregate([
      { $group: { _id: "$eventId", ticketsSold: { $sum: "$quantity" } } },
      { $sort: { ticketsSold: -1 } },
      { $limit: 6 }
    ]);

    // If no tickets have been sold yet across the platform, execute the fallback
    if (topOrders.length === 0) {
      const recent = await Event.find().sort({ createdAt: 1 }).limit(6).lean();
      
      const formattedRecent = await Promise.all(
        recent.map(async (e) => {
          const categoryDoc = await Category.findOne({ categoryId: e.categoryId }).lean();
          return buildEventRow(e, categoryDoc ? categoryDoc.name : null, 0);
        })
      );
      return res.json(formattedRecent);
    }

    // If trending events exist, format and return them
    const trendingEvents = await Promise.all(
      topOrders.map(async (item) => {
        const eventDoc = await Event.findById(item._id).lean();
        if (!eventDoc) return null;
        const categoryDoc = await Category.findOne({ categoryId: eventDoc.categoryId }).lean();
        return buildEventRow(eventDoc, categoryDoc ? categoryDoc.name : null, item.ticketsSold);
      })
    );

    res.json(trendingEvents.filter(e => e !== null));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get a single event by ID
// @route   GET /api/events/:id
export const getEventById = async (req, res) => {
  try {
    const row = await Event.findById(req.params.id).lean();
    if (!row) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Lookup matching values
    const categoryDoc = await Category.findOne({ categoryId: row.categoryId }).lean();
    const orders = await Order.find({ eventId: row._id }).lean();
    const totalTickets = orders.reduce((sum, order) => sum + (order.quantity || 0), 0);

    res.json(buildEventRow(row, categoryDoc ? categoryDoc.name : null, totalTickets));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Update an event field properties path natively
// @route   PATCH /api/events/:id
export const updateEvent = async (req, res) => {
  try {
    const { startDate, endDate, ...rest } = req.body;
    
    const updateData = { ...rest };
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);

    const event = await Event.findByIdAndUpdate(
  req.params.id,
  { $set: updateData },
  { returnDocument: 'after', runValidators: true } //  Clean, modern syntax
   ).lean();
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const categoryDoc = await Category.findOne({ categoryId: event.categoryId }).lean();
    const orders = await Order.find({ eventId: event._id }).lean();
    const totalTickets = orders.reduce((sum, order) => sum + (order.quantity || 0), 0);

    res.json(buildEventRow(event, categoryDoc ? categoryDoc.name : null, totalTickets));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Delete an event document file securely
// @route   DELETE /api/events/:id
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.sendStatus(204); 
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    List related events inside matching category scopes, excluding source file
// @route   GET /api/events/:id/related
export const getRelatedEvents = async (req, res) => {
  try {
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

    res.json(formattedRelated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};