const express = require("express");
const cartController = require("../controllers/cart.controller");
const router = express.Router();

// Route to add an item to the cart
router.post("/add", cartController.addItemToCart);

// Route to remove an item from the cart
router.post("/remove-item", cartController.removeItemFromCart);

// Route to clear the cart
router.post("/clear", cartController.clearCart);

// Route to get all items in the cart for a specific user
router.get("/:id", cartController.getCartItems);

module.exports = router;
