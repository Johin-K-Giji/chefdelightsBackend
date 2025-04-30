require("dotenv").config();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const { log } = require("console");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Utility: Verify Razorpay Signature
const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  const sign = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  return expectedSignature === signature;
};

// Create Order or Verify + Save Order
const createOrder = async (req, res) => {

  console.log(req.body,"body");
  
  const {
    amount,
    orderDetails,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    paymentMode, // Optional extra field
    transactionId, // Optional extra field,
    productIds 
  } = req.body;

  console.log(productIds,"idsss");
  

  // Step 1: If payment details provided, verify & save order
  if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    try {
      const addressParts = [
        orderDetails.house,
        orderDetails.street,
        orderDetails.city,
        orderDetails.state,
      ];
      const fullAddress = addressParts.filter(Boolean).join(", ");

      const newOrder = new Order({
        userName: orderDetails.name,
        phone: orderDetails.phone,
        address: fullAddress,
        orderAmount: amount,
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        razorpaySignature: razorpay_signature,
        transactionId: transactionId || razorpay_payment_id,
        paymentMode: paymentMode || "Online",
        productIds
      });

      await newOrder.save();

      return res.status(200).json({ success: true, message: "Payment verified and order saved" });
    } catch (error) {
      console.error("Order saving failed:", error.message);
      return res.status(500).json({ success: false, message: "Failed to save order" });
    }
  }

  // Step 2: Create Razorpay order if only amount is provided
  try {
    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_order_${Math.random().toString(36).slice(2)}`,
    };

    const order = await instance.orders.create(options);
    return res.status(200).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};

// Separate Verify API if needed externally
const verifyPayment = async (req, res) => {
  
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderDetails,
    totalAmount,
    paymentMode,
    transactionId,
    productIds
  } = req.body;

  const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

  if (!isValid) {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }

  try {
    const addressParts = [
      orderDetails.house,
      orderDetails.street,
      orderDetails.city,
      orderDetails.state,
    ];
    const fullAddress = addressParts.filter(Boolean).join(", ");

    const newOrder = new Order({
      userName: orderDetails.name,
      phone: orderDetails.phone,
      address: fullAddress,
      orderAmount: totalAmount,
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpaySignature: razorpay_signature,
      transactionId: transactionId || razorpay_payment_id,
      paymentMode: paymentMode || "Online",
      productIds
    });

    await newOrder.save();

    res.status(200).json({ success: true, message: "Payment verified and order saved" });
  } catch (err) {
    console.error("Error saving order:", err.message);
    res.status(500).json({ success: false, message: "Failed to save order" });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
