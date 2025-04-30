const express = require("express");
const cors = require("cors");
const app = express();
const productRoutes = require("./routes/productRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes= require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const path = require("path");
require("dotenv").config();
console.log("Key from .env directly:", require("dotenv").config().parsed);

const connectDB = require("./config/db");

connectDB();

// Enable CORS
const allowedOrigins = [
  "https://chefdelightsfoods.com",
  "https://www.chefdelightsfoods.com", 
  "http://localhost:3000",
  "http://13.61.182.49"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);

// Serve uploaded images
app.use('/static/products', express.static(path.join(__dirname, 'uploads/products')));

// Use Routes
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api/auth', authRoutes);

app.listen(4000, () => {
  console.log("Server running on port 5000");
});
