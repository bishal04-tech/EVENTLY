import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    // Links this order directly to an Event document using its unique MongoDB Hex ID
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event', 
      required: [true, 'Event ID is required'],
    },
    buyerName: {
      type: String,
      required: [true, 'Buyer name is required'],
      trim: true,
    },
    buyerEmail: {
      type: String,
      required: [true, 'Buyer email is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1, // Matches .default(1) from your Drizzle setup
    },
    totalAmount: {
      type: String,
      required: true,
      default: '0', // Matches .default("0") from your Drizzle setup
    },
  },
  {
    // Automatically generates and manages 'createdAt' and 'updatedAt' fields!
    timestamps: true, 
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;