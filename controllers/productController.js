const Product = require("../models/Product");
const path = require("path");

// Create a new product
const createProduct = async (req, res) => {
  try {
    console.log("🔵 Incoming Body:", req.body);
    console.log("🟡 Incoming Files:", req.files);

    const { name, price, description } = req.body;

    const coverImage = req.files?.coverImage?.[0]?.filename;
    const subImagesArray = req.files?.subImages || [];

    if (!coverImage) {
      console.error("❌ Cover image is missing.");
      return res.status(400).json({ message: "Cover image is required." });
    }

    // Log details of subImages if available
    if (subImagesArray.length === 0) {
      console.warn("⚠️ No subImages were uploaded.");
    } else {
      console.log("📁 SubImages Details:");
      subImagesArray.forEach((file, index) => {
        console.log(`   - [${index}] Filename: ${file.filename}`);
        console.log(`     Full path: ${path.join(__dirname, "..", "uploads", "products", file.filename)}`);
      });
    }

    const subImages = subImagesArray.map(file => file.filename);

    const newProduct = new Product({
      name,
      price,
      description,
      coverImage,
      subImages,
    });

    await newProduct.save();

    console.log("✅ Product created successfully.");
    console.log("🖼️ Cover Image Filename:", coverImage);
    console.log("📍 Cover Image Full Path:", path.join(__dirname, "..", "uploads", "products", coverImage));

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("🔥 Create Product Error:", error);
    res.status(500).json({ message: error.message });
  }
};



// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product
const updateProduct = (req, res) => {
  const { id } = req.params;  // Getting the product id from the URL parameter
  const { product_name, price_india, price_uae, product_description } = req.body;
  console.log(req.body);
  

  // Access the files if available
  const coverImage = req.files?.cover_image ? req.files.cover_image[0] : null;
  const subImages = req.files?.sub_images ? req.files.sub_images : [];

  // Find the product by ID
  Product.findById(id)
    .then(product => {
      if (!product) {
        return res.status(404).send("Product not found");
      }

      // Update product details
      product.name = product_name || product.name;
      if (!product.price) {
        product.price = {};
      }
      product.price.india = price_india !== undefined ? price_india : product.price.india;
      product.price.uae = price_uae !== undefined ? price_uae : product.price.uae;
      
      product.description = product_description || product.description;

      // If new cover image is uploaded, update it
      if (coverImage) {
        product.coverImage = coverImage.path; // Assuming the path is saved
      }

      // If new sub images are uploaded, update them
      if (subImages.length > 0) {
        product.subImages = subImages.map(img => img.path); // Assuming the paths are saved
      }

      // Save the updated product
      return product.save();
    })
    .then(() => {
      res.status(200).send("Product updated successfully");
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("Error updating product");
    });
};


// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Export all controller functions
module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
