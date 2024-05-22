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
    const count = await db.user.count(); // Ensure this references the correct model

    // Only seed data if the table is empty
    if (count > 0) return;

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

    // Seed products
    const productCount = await db.product.count();
    if (productCount === 0) {
      await db.product.bulkCreate([
        {
          name: "Organic Blueberries",
          description:
            "Fresh, plump organic blueberries perfect for your morning smoothie.",
          price: 4.99,
          quantity: 100,
          unit: "pint",
          image: "url_to_image1",
          isSpecial: false,
          specialPrice: null,
        },
        {
          name: "Local Honey",
          description: "Raw and unfiltered honey sourced from local farms.",
          price: 7.99,
          quantity: 75,
          unit: "unit2",
          image: "12oz jar",
          isSpecial: false,
          specialPrice: 15.0,
        },
        // Add more products as needed
      ]);
    }

    console.log("Seed data added successfully.");
  } catch (error) {
    console.error("Failed to seed data:", error);
  }
}

module.exports = db;
