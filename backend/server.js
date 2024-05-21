const express = require("express");
const cors = require("cors");
// Placeholder for database import; ensure to uncomment or modify as per actual path when ready
// const db = require("./src/database");

// Placeholder for database synchronization; uncomment when db is configured
// db.sync();

const app = express();

// Parse requests of content-type - application/json
app.use(express.json());

// Add CORS support to handle cross-origin requests
app.use(cors());

// Simple route to confirm the server is working
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

// Placeholder for route imports; uncomment and ensure paths are correct when routes are defined
// require("./src/routes/user.routes.js")(express, app);
// require("./src/routes/post.routes.js")(express, app);

// Set the server to listen on a port
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
