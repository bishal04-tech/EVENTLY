import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    // Since your events use a numeric categoryId, we keep a custom Number field 
    // here to make mapping them together incredibly easy without complex SQL joins.
    categoryId: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true, // Matches .unique() from your Drizzle setup
      trim: true,
    },
  },
  {
    // Natively handles 'createdAt' and 'updatedAt' timestamps automatically!
    timestamps: true, 
  }
);

const Category = mongoose.model('Category', categorySchema);
export default Category;