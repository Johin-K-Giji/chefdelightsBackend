const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userName: String,
  phone: String,
  address: String,
  orderAmount: Number,
  productIds: [String],
  razorpayPaymentId: String,
  razorpayOrderId: String,
  razorpaySignature: String,
  transactionId: String,
  paymentMode: String, // e.g., 'Online', 'COD'
  status: {
    type: Number,
    default: 0, // 0 - Pending, 1 - Completed or Shipped, etc.
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
