const express = require("express");
const productController = require("../controllers/product.controller");
const router = express.Router();

// Route to get all products
router.get("/", productController.getAllProducts);

// Route to get a single product by ID
router.get("/:id", productController.getProductById);

// Route to create a new product
router.post("/", productController.createProduct);

// Route to update a product
router.put("/:id", productController.updateProduct);

// Route to delete a product
router.delete("/:id", productController.deleteProduct);

module.exports = router;
