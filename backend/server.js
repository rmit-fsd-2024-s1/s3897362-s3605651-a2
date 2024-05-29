require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./src/database"); // Ensure this path is correct

// Import the clearInactiveCarts job
require("./src/jobs/clearInactiveCarts");

// Database will be synchronized in the background.
db.sync();

const app = express();

// Parse requests of content-type - application/json
app.use(express.json());

// Add CORS support to handle cross-origin requests
app.use(cors());

// Simple route to confirm the server is working
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

// Import and use user routes
const userRoutes = require("./src/routes/user.routes");
app.use("/api/users", userRoutes);

// Import and use product routes
const productRoutes = require("./src/routes/product.routes");
app.use("/api/products", productRoutes);

// Import and use cart routes
const cartRoutes = require("./src/routes/cart.routes");
app.use("/api/cart", cartRoutes);

// Set the server to listen on a port
const PORT = process.env.PORT || 4000; // Using process.env.PORT for flexibility with deployment environments
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
