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
db.cart = require("./models/cart")(db.sequelize, DataTypes);
db.cartItem = require("./models/cartItem")(db.sequelize, DataTypes);
db.review = require("./models/review")(db.sequelize, DataTypes);

// Set up associations
db.user.hasOne(db.cart, { foreignKey: "user_id" });
db.cart.belongsTo(db.user, { foreignKey: "user_id" });

db.cart.hasMany(db.cartItem, { foreignKey: "cart_id" });
db.cartItem.belongsTo(db.cart, { foreignKey: "cart_id" });

db.product.hasMany(db.cartItem, { foreignKey: "product_id" });
db.cartItem.belongsTo(db.product, { foreignKey: "product_id" });

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
          quantity: 10,
          unit: "pint",
          image:
            "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          isSpecial: true,
          specialPrice: 3.49,
        },
        {
          name: "Local Honey",
          description: "Raw and unfiltered honey sourced from local farms.",
          price: 7.99,
          quantity: 10,
          unit: "12oz jar",
          image:
            "https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          isSpecial: true,
          specialPrice: 5.98,
        },
        {
          name: "Almond Milk",
          description:
            "Organic almond milk, unsweetened and made with real almonds.",
          price: 2.99,
          quantity: 10,
          unit: "quart",
          image:
            "https://images.unsplash.com/photo-1626196340104-2d6769a08761?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          isSpecial: false,
          specialPrice: null,
        },
        {
          name: "Organic Kale Chips",
          description:
            "Crispy and lightly salted, these kale chips are a healthy snack.",
          price: 3.99,
          quantity: 10,
          unit: "bag",
          image:
            "https://images.unsplash.com/photo-1534942240902-fc71ff3dfaee?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          isSpecial: false,
          specialPrice: null,
        },
        {
          name: "Grass-fed Ground Beef",
          description:
            "High-quality, grass-fed ground beef with a rich flavor.",
          price: 8.99,
          quantity: 10,
          unit: "lb",
          image:
            "https://images.unsplash.com/photo-1690983323540-d6e889c4b107?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          isSpecial: false,
          specialPrice: null,
        },
        {
          name: "Organic Free-Range Eggs",
          description:
            "Large eggs from chickens raised in a free-range, organic environment.",
          price: 4.99,
          quantity: 10,
          unit: "dozen",
          image:
            "https://images.unsplash.com/photo-1586802990181-a5771596eaea?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          isSpecial: true,
          specialPrice: 2.49,
        },
        {
          name: "Whole Grain Bread",
          description:
            "Baked fresh, this whole grain bread is hearty and full of fiber.",
          price: 3.49,
          quantity: 10,
          unit: "loaf",
          image:
            "https://images.unsplash.com/photo-1626423642268-24cc183cbacb?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          isSpecial: false,
          specialPrice: null,
        },
        {
          name: "Organic Avocados",
          description:
            "Creamy and nutritious, perfect for guacamole or salads.",
          price: 1.49,
          quantity: 10,
          unit: "each",
          image:
            "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?q=80&w=1375&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          isSpecial: false,
          specialPrice: null,
        },
      ]);
      console.log("Seed data added successfully.");
    }
  } catch (error) {
    console.error("Failed to seed data:", error);
  }
}

module.exports = db;
