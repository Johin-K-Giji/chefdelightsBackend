const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads/products directory exists
const uploadDir = path.join(__dirname, "../uploads/products");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config to save in uploads/products
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// Accept coverImage and max 5 subImages
const uploadFields = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "subImages", maxCount: 5 },
]);

// Routes
router.post("/create", uploadFields, createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/edit/:id", uploadFields, updateProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;
