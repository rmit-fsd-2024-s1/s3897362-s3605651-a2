const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.js");

const db = {
  Op: Sequelize.Op,
};

// Create Sequelize.
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.DIALECT,
});

// Import models
db.user = require("./models/user")(db.sequelize, DataTypes);
db.product = require("./models/product")(db.sequelize, DataTypes);

// Include a sync option with seed data logic included.
db.sync = async () => {
  try {
    // Sync schema.
    await db.sequelize.sync();

    // Can sync with force if the schema has become out of date - note that syncing with force is a destructive operation.
    // await db.sequelize.sync({ force: true });
    console.log("Database synchronized successfully.");
    await seedData();
  } catch (error) {
    console.error("Failed to synchronize database:", error);
  }
};

async function seedData() {
  try {
    // Seed users
    const userCount = await db.user.count();
    if (userCount === 0) {
      const argon2 = require("argon2");

      // Hash the password and create the first user
      let hash = await argon2.hash("abc123", { type: argon2.argon2id });
      await db.user.create({
        username: "sdatta",
        email: "sdatta@example.com", // Added the email field
        password_hash: hash,
        first_name: "Sagar",
        last_name: "Datta",
      });

      // Hash another password and create the second user
      hash = await argon2.hash("def456", { type: argon2.argon2id });
      await db.user.create({
        username: "mjackson",
        email: "mjackson@example.com", // Added the email field
        password_hash: hash,
        first_name: "Matthew",
        last_name: "Jackson",
      });
    }

    // Seed products
    const productCount = await db.product.count();
    console.log(`Product count: ${productCount}`); // Debug logging
    if (productCount === 0) {
      await db.product.bulkCreate([
        {
          name: "Organic Blueberries",
          description:
            "Fresh, plump organic blueberries perfect for your morning smoothie.",
          price: 4.99,
          quantity: 100,
          unit: "pint",
          image:
            "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          isSpecial: false,
          specialPrice: null,
        },
        {
          name: "Local Honey",
          description: "Raw and unfiltered honey sourced from local farms.",
          price: 7.99,
          quantity: 75,
          unit: "12oz jar",
          image:
            "https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          isSpecial: false,
          specialPrice: null,
        },
        // Add more products as needed
      ]);
      console.log("Seed data added successfully.");
    }
  } catch (error) {
    console.error("Failed to seed data:", error);
  }
}

module.exports = db;
