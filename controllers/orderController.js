const Order = require("../models/Order");
const Product = require("../models/Product");

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    // Enrich each order with product details
    const ordersWithProductDetails = await Promise.all(
      orders.map(async (order) => {
        const products = await Product.find({ _id: { $in: order.productIds } });
        return {
          ...order.toObject(), // convert Mongoose doc to plain object
          products, // attach full product info
        };
      })
    );

    res.status(200).json(ordersWithProductDetails);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: 1 },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated",
      order: updatedOrder,
    });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { getOrders ,updateOrderStatus};
