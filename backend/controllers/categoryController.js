// import Category from '../models/Category.js';

// // @desc    Get all categories ordered by name alphabetically
// // @route   GET /api/categories
// export const getCategories = async (req, res) => {
//   try {
//     // Queries the collection, orders elements by name alphabetically, and optimizes with .lean()
//     const categories = await Category.find().sort({ name: 1 }).lean();
    
//     // Format rows cleanly matching your original layout expectations
//     const formattedCategories = categories.map((c) => ({
//       id: c._id, // Remaps internal MongoDB Hex ID to 'id' for frontend consistency
//       categoryId: c.categoryId,
//       name: c.name,
//       createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : null,
//       updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : null,
//     }));

//     res.json(formattedCategories);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // @desc    Create a new system category (Admin feature)
// // @route   POST /api/categories
// export const createCategory = async (req, res) => {
//   try {
//     const { categoryId, name } = req.body;

//     // Direct inline validation (replaces Zod error intercepts)
//     if (!categoryId || !name) {
//       return res.status(400).json({ error: 'Please provide both categoryId and name parameters' });
//     }

//     const category = await Category.create({
//       categoryId: Number(categoryId),
//       name: name.trim()
//     });

//     res.status(201).json({
//       id: category._id,
//       categoryId: category.categoryId,
//       name: category.name,
//       createdAt: category.createdAt ? new Date(category.createdAt).toISOString() : null
//     });
//   } catch (error) {
//     // Gracefully handles Mongoose custom schema validation constraints or unique indexes throw violations
//     res.status(400).json({ error: error.message });
//   }
// };
import Category from '../models/Category.js';

// Define a stable cache key
const CATEGORIES_CACHE_KEY = 'cache:categories:all';

// @desc    Get all categories ordered by name alphabetically (With Redis Caching)
// @route   GET /api/categories
export const getCategories = async (req, res) => {
  try {
    const { redis } = req; // Extract Redis from middleware injection

    // 1. Attempt to grab cached categories from Upstash Redis
    const cachedCategories = await redis.get(CATEGORIES_CACHE_KEY);

    if (cachedCategories) {
      console.log('⚡ Serving categories from Upstash Redis Cache');
      return res.status(200).json(JSON.parse(cachedCategories));
    }

    console.log('🐢 Cache miss. Querying MongoDB Atlas...');

    // 2. Fallback to MongoDB if cache is empty
    const categories = await Category.find().sort({ name: 1 }).lean();
    
    // Format rows cleanly for frontend consistency
    const formattedCategories = categories.map((c) => ({
      id: c._id, 
      categoryId: c.categoryId,
      name: c.name,
      createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : null,
      updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : null,
    }));

    // 3. Save the formatted result into Redis for next time 
    // 'EX', 3600 sets a 1-hour expiration fallback window
    await redis.set(CATEGORIES_CACHE_KEY, JSON.stringify(formattedCategories), 'EX', 3600);

    return res.status(200).json(formattedCategories);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// @desc    Create a new system category (Admin feature + Cache Invalidation)
// @route   POST /api/categories
export const createCategory = async (req, res) => {
  try {
    const { redis } = req; // Extract Redis from middleware injection
    const { categoryId, name } = req.body;

    // Direct inline validation
    if (!categoryId || !name) {
      return res.status(400).json({ error: 'Please provide both categoryId and name parameters' });
    }

    // Save item to MongoDB
    const category = await Category.create({
      categoryId: Number(categoryId),
      name: name.trim()
    });

    // 🔥 CRITICAL: Invalidate the cache since database data has altered
    // This forces the next GET request to fetch fresh data from MongoDB
    await redis.del(CATEGORIES_CACHE_KEY);
    console.log('🧹 Categories cache cleared due to new category addition');

    return res.status(201).json({
      id: category._id,
      categoryId: category.categoryId,
      name: category.name,
      createdAt: category.createdAt ? new Date(category.createdAt).toISOString() : null
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};