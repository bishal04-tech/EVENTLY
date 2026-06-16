// import Order from '../models/Order.js';
// import Event from '../models/events.js';

// // Clean Helper Function to format rows matching your original Drizzle UI expectations
// function buildOrderRow(order, eventTitle = null) {
//   return {
//     id: order._id, // Maps MongoDB's internal _id to 'id' for frontend consistency
//     eventId: order.eventId,
//     buyerName: order.buyerName,
//     buyerEmail: order.buyerEmail,
//     quantity: order.quantity,
//     totalAmount: order.totalAmount,
//     createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : null,
//     eventTitle: eventTitle || null,
//   };
// }

// // @desc    Get all orders with Text Search and Event filtering
// // @route   GET /api/orders
// export const getOrders = async (req, res) => {
//   try {
//     const { search, eventId } = req.query;
//     let queryFilter = {};

//     // 1. Handle cross-entity search requirements dynamically using MongoDB regex
//     if (search) {
//       // First, look up any events matching the search string to grab their IDs
//       const matchedEvents = await Event.find({
//         title: { $regex: search, $options: 'i' }
//       }).select('_id').lean();
      
//       const matchedEventIds = matchedEvents.map(e => e._id);

//       // Construct an $or match condition evaluating buyer info OR referenced event text matches
//       queryFilter.$or = [
//         { buyerName: { $regex: search, $options: 'i' } },
//         { buyerEmail: { $regex: search, $options: 'i' } },
//         { eventId: { $in: matchedEventIds } }
//       ];
//     }

//     // 2. Handle strict ID matching filters if provided
//     if (eventId) {
//       queryFilter.eventId = eventId;
//     }

//     // Execute lookup query, ordering from oldest to newest to match Drizzle behavior
//     const orders = await Order.find(queryFilter).sort({ createdAt: 1 }).lean();

//     // Map rows and dynamically compile corresponding event titles sequentially
//     const formattedOrders = await Promise.all(
//       orders.map(async (o) => {
//         const eventDoc = await Event.findById(o.eventId).select('title').lean();
//         return buildOrderRow(o, eventDoc ? eventDoc.title : null);
//       })
//     );

//     res.json(formattedOrders);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // @desc    Register / Purchase tickets for an event
// // @route   POST /api/orders
// export const createOrder = async (req, res) => {
//   try {
//     const { eventId, buyerName, buyerEmail, quantity, totalAmount } = req.body;

//     // Inline parameter validation (replaces Zod strict schemas checks)
//     if (!eventId || !buyerName || !buyerEmail) {
//       return res.status(400).json({ error: 'Please provide eventId, buyerName, and buyerEmail parameters' });
//     }

//     // Check if the target event document exists before confirming checkout entries
//     const event = await Event.findById(eventId).select('title').lean();
//     if (!event) {
//       return res.status(404).json({ error: 'The targeted event does not exist' });
//     }

//     const order = await Order.create({
//       eventId,
//       buyerName,
//       buyerEmail,
//       quantity: Number(quantity || 1),
//       totalAmount: String(totalAmount || '0')
//     });

//     res.status(201).json(buildOrderRow(order.toObject(), event.title));
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // @desc    Get a single order record by ID
// // @route   GET /api/orders/:id
// export const getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id).lean();
//     if (!order) {
//       return res.status(404).json({ error: 'Order not found' });
//     }

//     // Lookup corresponding event details
//     const event = await Event.findById(order.eventId).select('title').lean();

//     res.json(buildOrderRow(order, event ? event.title : null));
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

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
    console.error('❌ Failed to fully sweep impacted Redis domain caches:', err);
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

    const cachedOrders = await redis.get(cacheKey);
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
    await redis.set(cacheKey, JSON.stringify(formattedOrders), 'EX', 300);

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

    const cachedOrder = await redis.get(cacheKey);
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
    await redis.set(cacheKey, JSON.stringify(formattedOrder), 'EX', 1800);

    return res.json(formattedOrder);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};