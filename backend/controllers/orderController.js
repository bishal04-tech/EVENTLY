

import Order from '../models/Order.js';
import Event from '../models/events.js';

// Clean Helper Function to format rows matching original UI expectations
function buildOrderRow(order, eventTitle = null) {
  return {
    id: order._id, 
    eventId: order.eventId,
    buyerName: order.buyerName,
    buyerEmail: order.buyerEmail,
    quantity: order.quantity,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : null,
    eventTitle: eventTitle || null,
  };
}

// Helper utility to safely invalidate collections related to orders and sales metrics
async function clearOrdersCache(redis, eventId) {
  try {
    // 1. Find and delete all global or filtered order list queries
    const keys = await redis.keys('cache:orders:*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }

    // 2. Clear cache keys from the events domain affected by ticket counts
    const generalEventKeys = await redis.keys('cache:events:all:*');
    if (generalEventKeys.length > 0) {
      await redis.del(...generalEventKeys);
    }
    
    await redis.del('cache:events:trending');
    if (eventId) {
      await redis.del(`cache:events:single:${eventId}`);
    }

    console.log('🧹 Orders, impacted Event aggregations, and metrics caches successfully invalidated');
  } catch (err) {
    console.error('❌ Failed to fully sweep impacted Redis domain caches:', err.message);
  }
}

// @desc    Get all orders with Text Search and Event filtering
// @route   GET /api/orders
export const getOrders = async (req, res) => {
  try {
    const { redis } = req;
    const { search = '', eventId = '' } = req.query;

    // Generate parameter-isolated key to capture precise text queries/filters
    const cacheKey = `cache:orders:all:s_${search}:e_${eventId}`;

    let cachedOrders = null;
    try {
      cachedOrders = await redis.get(cacheKey);
    } catch (redisErr) {
      console.error('Redis GET failed (falling back to DB):', redisErr.message);
    }

    if (cachedOrders) {
      console.log('⚡ Serving orders dashboard list from Upstash Redis Cache');
      return res.json(JSON.parse(cachedOrders));
    }

    let queryFilter = {};

    // Handle cross-entity search requirements dynamically using MongoDB regex
    if (search) {
      const matchedEvents = await Event.find({
        title: { $regex: search, $options: 'i' }
      }).select('_id').lean();
      
      const matchedEventIds = matchedEvents.map(e => e._id);

      queryFilter.$or = [
        { buyerName: { $regex: search, $options: 'i' } },
        { buyerEmail: { $regex: search, $options: 'i' } },
        { eventId: { $in: matchedEventIds } }
      ];
    }

    if (eventId) {
      queryFilter.eventId = eventId;
    }

    const orders = await Order.find(queryFilter).sort({ createdAt: 1 }).lean();

    const formattedOrders = await Promise.all(
      orders.map(async (o) => {
        const eventDoc = await Event.findById(o.eventId).select('title').lean();
        return buildOrderRow(o, eventDoc ? eventDoc.title : null);
      })
    );

    // Cache the order lists for 5 minutes (300 seconds)
    try {
      await redis.set(cacheKey, JSON.stringify(formattedOrders), 'EX', 300);
    } catch (redisErr) {
      console.error('Redis SET failed:', redisErr.message);
    }

    return res.json(formattedOrders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// @desc    Register / Purchase tickets for an event
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { redis } = req;
    const { eventId, buyerName, buyerEmail, quantity, totalAmount } = req.body;

    if (!eventId || !buyerName || !buyerEmail) {
      return res.status(400).json({ error: 'Please provide eventId, buyerName, and buyerEmail parameters' });
    }

    const event = await Event.findById(eventId).select('title').lean();
    if (!event) {
      return res.status(404).json({ error: 'The targeted event does not exist' });
    }

    const order = await Order.create({
      eventId,
      buyerName,
      buyerEmail,
      quantity: Number(quantity || 1),
      totalAmount: String(totalAmount || '0')
    });

    // Cascade clear the caches since sales calculations across the server have updated
    await clearOrdersCache(redis, eventId);

    return res.status(201).json(buildOrderRow(order.toObject(), event.title));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// @desc    Get a single order record by ID
// @route   GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const { redis } = req;
    const cacheKey = `cache:orders:single:${req.params.id}`;

    let cachedOrder = null;
    try {
      cachedOrder = await redis.get(cacheKey);
    } catch (redisErr) {
      console.error('Redis GET failed (falling back to DB):', redisErr.message);
    }

    if (cachedOrder) {
      console.log(`⚡ Serving individual order item ${req.params.id} from Upstash Redis`);
      return res.json(JSON.parse(cachedOrder));
    }

    const order = await Order.findById(req.params.id).lean();
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const event = await Event.findById(order.eventId).select('title').lean();
    const formattedOrder = buildOrderRow(order, event ? event.title : null);

    // Cache specific invoice profiles longer (30 minutes) as transaction history rarely changes
    try {
      await redis.set(cacheKey, JSON.stringify(formattedOrder), 'EX', 1800);
    } catch (redisErr) {
      console.error('Redis SET failed:', redisErr.message);
    }

    return res.json(formattedOrder);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};