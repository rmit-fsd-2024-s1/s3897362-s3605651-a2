const db = require("../database");

exports.addItemToCart = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  try {
    // Find the user's cart
    let cart = await db.cart.findOne({ where: { user_id } });

    // If the cart doesn't exist, create one
    if (!cart) {
      cart = await db.cart.create({ user_id });
    }

    // Find the product
    const product = await db.product.findByPk(product_id);

    // Check if the product exists and if the quantity is greater than 0
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // Find or create the cart item
    let cartItem = await db.cartItem.findOne({
      where: { cart_id: cart.cart_id, product_id },
    });

    if (cartItem) {
      // Update the quantity if the cart item already exists
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Create a new cart item
      cartItem = await db.cartItem.create({
        cart_id: cart.cart_id,
        product_id,
        quantity,
      });
    }

    // Decrease the product quantity
    product.quantity -= quantity;
    await product.save();

    // Update the cart's updatedAt timestamp
    cart.updatedAt = new Date();
    await cart.save();

    res.json(cartItem);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({
      message: "An error occurred while adding the item to the cart.",
    });
  }
};

exports.removeItemFromCart = async (req, res) => {
  console.log("Route /remove-item hit");
  console.log("Request body:", req.body);

  const { user_id, product_id, quantity } = req.body;

  console.log(
    `Extracted - user_id: ${user_id}, product_id: ${product_id}, quantity: ${quantity}`
  );

  try {
    // Find the user's cart
    const cart = await db.cart.findOne({ where: { user_id } });
    if (!cart) {
      console.log(`Cart not found for user_id: ${user_id}`);
      return res.status(404).json({ message: "Cart not found" });
    }
    console.log(`Cart found: ${cart.cart_id}`);

    // Find the cart item
    const cartItem = await db.cartItem.findOne({
      where: { cart_id: cart.cart_id, product_id },
    });
    if (!cartItem) {
      console.log(
        `Cart item not found for cart_id: ${cart.cart_id} and product_id: ${product_id}`
      );
      return res.status(404).json({ message: "Cart item not found" });
    }
    console.log(`Cart item found: ${cartItem.cart_item_id}`);

    // Update the quantity or remove the cart item
    if (cartItem.quantity > quantity) {
      cartItem.quantity -= quantity;
      await cartItem.save();
      console.log(`Cart item quantity updated to: ${cartItem.quantity}`);
    } else {
      await cartItem.destroy();
      console.log(`Cart item removed: ${cartItem.cart_item_id}`);
    }

    // Increase the product quantity
    const product = await db.product.findByPk(product_id);
    if (product) {
      product.quantity += quantity;
      await product.save();
      console.log(`Product quantity updated to: ${product.quantity}`);
    } else {
      console.log(`Product not found for product_id: ${product_id}`);
    }

    // Update the cart's updatedAt timestamp
    cart.updatedAt = new Date();
    await cart.save();
    console.log(`Cart updatedAt timestamp updated`);

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({
      message: "An error occurred while removing the item from the cart.",
    });
  }
};
exports.getCartItems = async (req, res) => {
  const { id } = req.params; // Use id instead of user_id

  console.log(`Fetching cart items for user_id: ${id}`);

  try {
    // Find the user's cart
    const cart = await db.cart.findOne({ where: { user_id: id } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find all cart items
    const cartItems = await db.cartItem.findAll({
      where: { cart_id: cart.cart_id },
      include: {
        model: db.product,
        attributes: ["name", "price", "isSpecial", "specialPrice"],
      },
    });

    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the cart items." });
  }
};

exports.clearCart = async (req, res) => {
  console.log("Request body:", req.body); // Log the request body for debugging

  const { user_id } = req.body;
  console.log(`Extracted user_id: ${user_id}`); // Log the extracted user_id for debugging

  if (!user_id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Find the user's cart
    const cart = await db.cart.findOne({ where: { user_id } });
    if (!cart) {
      console.log(`Cart not found for user_id: ${user_id}`);
      return res.status(404).json({ message: "Cart not found" });
    }
    console.log(`Cart found: ${cart.cart_id}`);

    // Find all cart items
    const cartItems = await db.cartItem.findAll({
      where: { cart_id: cart.cart_id },
    });

    // Restore product quantities
    for (const cartItem of cartItems) {
      const product = await db.product.findByPk(cartItem.product_id);
      if (product) {
        product.quantity += cartItem.quantity;
        await product.save();
        console.log(
          `Restored ${cartItem.quantity} of product_id: ${product.id}`
        );
      }
    }

    // Delete all cart items
    await db.cartItem.destroy({ where: { cart_id: cart.cart_id } });
    console.log(`Cleared cart items for cart_id: ${cart.cart_id}`);

    // Update the cart's updatedAt timestamp
    cart.updatedAt = new Date();
    await cart.save();
    console.log(`Cart updatedAt timestamp updated`);

    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res
      .status(500)
      .json({ message: "An error occurred while clearing the cart." });
  }
};

exports.checkout = async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Find the user's cart
    const cart = await db.cart.findOne({ where: { user_id } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Delete all cart items without restoring product quantities
    await db.cartItem.destroy({ where: { cart_id: cart.cart_id } });

    // Update the cart's updatedAt timestamp
    cart.updatedAt = new Date();
    await cart.save();

    res.json({ message: "Checkout successful. Cart is now empty." });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ message: "An error occurred during checkout." });
  }
};
