import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
    },
    price: {
      type: String,
      default: '',
    },
    isFree: {
      type: Boolean,
      required: true,
      default: false,
    },
    url: {
      type: String,
      default: '',
    },
    categoryId: {
      type: Number, // Or mongoose.Schema.Types.ObjectId if referencing a Category model
      required: [true, 'Category ID is required'],
    },
    organizerName: {
      type: String,
      default: '',
    },
    user: {
    type: mongoose.Schema.Types.ObjectId, // Stores MongoDB's unique document ID hash
    ref: 'User',                           // Connects this field directly to your 'User' collection
    required: [true, 'An event must belong to a registered creator']
    }
  },
  {
    timestamps: true, // This automatically manages 'createdAt' and 'updatedAt' fields for you!
  }
);

const Event = mongoose.model('Event', eventSchema);
export default Event;