const cron = require("node-cron");
const db = require("../database");

const clearInactiveCarts = async () => {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  try {
    // Find all carts that haven't been updated in the last 15 minutes
    const inactiveCarts = await db.cart.findAll({
      where: {
        updatedAt: {
          [db.Op.lt]: fifteenMinutesAgo,
        },
      },
    });

    for (const cart of inactiveCarts) {
      // Restore product quantities
      const cartItems = await db.cartItem.findAll({
        where: { cart_id: cart.cart_id },
      });
      for (const cartItem of cartItems) {
        const product = await db.product.findByPk(cartItem.product_id);
        if (product) {
          product.quantity += cartItem.quantity;
          await product.save();
        }
      }

      // Clear the cart
      await db.cartItem.destroy({ where: { cart_id: cart.cart_id } });
    }

    // Delete carts that have been cleared
    await db.cart.destroy({
      where: {
        cart_id: inactiveCarts.map((cart) => cart.cart_id),
      },
    });

    console.log("Cleared inactive carts");
  } catch (error) {
    console.error("Error clearing inactive carts:", error);
  }
};

// Schedule the job to run every minute
cron.schedule("* * * * *", clearInactiveCarts);
