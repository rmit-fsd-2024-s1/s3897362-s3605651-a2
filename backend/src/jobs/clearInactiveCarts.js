// Import the node-cron module
const cron = require("node-cron");
// Import the database
const db = require("../database");

// Clear inactive carts
const clearInactiveCarts = async () => {
  // Define 15 minutes ago
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  try {
    // Find all carts that haven't been updated in the last 15 minutes
    const inactiveCarts = await db.cart.findAll({
      where: {
        // updatedAt is a built-in column that gets updated automatically
        updatedAt: {
          // less than fifteenMinutesAgo
          [db.Op.lt]: fifteenMinutesAgo,
        },
      },
    });

    // Loop through each inactive cart
    for (const cart of inactiveCarts) {
      // Find all cart items in the cart
      const cartItems = await db.cartItem.findAll({
        // where cart_id is the cart's id
        where: { cart_id: cart.cart_id },
      });
      // Loop through each cart item
      for (const cartItem of cartItems) {
        // Find the product
        const product = await db.product.findByPk(cartItem.product_id);
        // If the product exists
        if (product) {
          // Add the quantity back to the product
          product.quantity += cartItem.quantity;
          // Save the product
          await product.save();
        }
      }

      // Clear the cart
      await db.cartItem.destroy({ where: { cart_id: cart.cart_id } });
    }

    console.log("Cleared inactive carts");
  } catch (error) {
    console.error("Error clearing inactive carts:", error);
  }
};

// Schedule the job to run every minute
cron.schedule("* * * * *", clearInactiveCarts);
