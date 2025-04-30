const express = require("express");
const cors = require("cors");
const app = express();
const productRoutes = require("./routes/productRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
connectDB();

// Allow listed origins
const allowedOrigins = [
  "https://chefdelightsfoods.com",
  "https://www.chefdelightsfoods.com",
  "http://13.61.182.49"
];

// Set up CORS
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};




// Use CORS
app.use(cors(corsOptions));

// Parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/static/products', express.static(path.join(__dirname, 'uploads/products')));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api/auth', authRoutes);

// Start server
app.listen(4000, () => {
  console.log("Server running on port 4000");
});
