const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: {
    india: { type: Number, required: true },
    uae: { type: Number, required: true },
  },
  description: { type: String, required: true },
  coverImage: { type: String, required: true },
  subImages: [String],
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
