require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./src/database"); // Ensure this path is correct

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
const userRoutes = require("./src/routes/user.routes"); // Adjust the path if necessary
app.use("/api/users", userRoutes);

// Import and use product routes
const productRoutes = require("./src/routes/product.routes"); // Adjust the path if necessary
app.use("/api/products", productRoutes);

// Set the server to listen on a port
const PORT = process.env.PORT || 4000; // Using process.env.PORT for flexibility with deployment environments
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
