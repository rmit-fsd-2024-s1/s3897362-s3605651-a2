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

// Include a sync option with seed data logic included.
db.sync = async () => {
  // Sync schema.
  await db.sequelize.sync();

  // Can sync with force if the schema has become out of date - note that syncing with force is a destructive operation.
  // await db.sequelize.sync({ force: true });

  await seedData();
};

async function seedData() {
  const count = await db.user.count();

  // Only seed data if necessary.
  if (count > 0) return;

  const argon2 = require("argon2");

  let hash = await argon2.hash("abc123", { type: argon2.argon2id });
  await db.user.create({
    username: "sdatta",
    password_hash: hash,
    first_name: "Sagar",
    last_name: "Datta",
  });

  hash = await argon2.hash("def456", { type: argon2.argon2id });
  await db.user.create({
    username: "mjackson",
    password_hash: hash,
    first_name: "Matthew",
    last_name: "Jackson",
  });
}

module.exports = db;
