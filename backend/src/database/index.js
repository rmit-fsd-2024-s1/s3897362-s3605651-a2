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

// Initialize the User model
db.user = require("./models/user")(db.sequelize, DataTypes);

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

    console.log("Seed data added successfully.");
  } catch (error) {
    console.error("Failed to seed data:", error);
  }
}

module.exports = db;
