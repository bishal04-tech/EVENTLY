import Event from '../models/events.js';      // Adjust paths to your actual Mongoose models
import Order from '../models/Order.js';
import Category from '../models/Category.js';

// @desc    Get global summary metrics for the dashboard
// @route   GET /api/stats/dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();

    // 1. Run count and revenue aggregations concurrently for efficiency
    const [
      totalEvents,
      totalOrders,
      upcomingEvents,
      freeEvents,
      revenueResult
    ] = await Promise.all([
      Event.countDocuments({}),
      Order.countDocuments({}),
      Event.countDocuments({ startDate: { $gt: now } }),
      Event.countDocuments({ isFree: true }),
      Order.aggregate([
        {
          $group: {
            _id: null,
            // Converts string amounts to numbers on-the-fly to sum up properly
            total: { $sum: { $toDouble: '$totalAmount' } }
          }
        }
      ])
    ]);

    // Extract revenue from the aggregation array pipeline safely
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total.toFixed(2) : "0.00";

    const stats = {
      totalEvents,
      totalOrders,
      totalRevenue: String(totalRevenue), // Kept as string to mirror your original schema design
      upcomingEvents,
      freeEvents,
      paidEvents: totalEvents - freeEvents
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get event counts categorized, sorted from highest to lowest activity
// @route   GET /api/stats/categories
export const getCategoryStats = async (req, res) => {
  try {
    // Replicates the LEFT JOIN + GROUP BY + ORDER BY SQL block using MongoDB's aggregation pipeline
    const categoryStats = await Category.aggregate([
      {
        $lookup: {
          from: 'events',            // Must match your exact MongoDB collection name for Events
          localField: '_id',         // Using MongoDB's standard hex _id field
          foreignField: 'categoryId', 
          as: 'matchedEvents'
        }
      },
      {
        $project: {
          _id: 0,                    // Suppresses the default wrapper root ID
          categoryId: '$_id',        // Remaps the hex ID field to 'categoryId' for frontend expectation
          categoryName: '$name',
          eventCount: { $size: '$matchedEvents' } // Counts array elements generated from the lookup
        }
      },
      {
        $sort: { eventCount: -1 }    // Sorts descending (highest count first)
      }
    ]);

    res.json(categoryStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};