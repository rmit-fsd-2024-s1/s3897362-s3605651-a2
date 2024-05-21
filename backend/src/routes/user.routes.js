const express = require("express");
const users = require("../controllers/user.controller"); // Adjust the path as necessary
const router = express.Router();

// Route to get all users
router.get("/", users.getAllUsers);

// Route to get a single user by ID
router.get("/:id", users.getUserById);

// Route for user login
router.post("/login", users.login);

// Route to create a new user
router.post("/", users.createUser);

// Route to update a user
router.put("/:id", users.updateUser);

// Route to delete a user
router.delete("/:id", users.deleteUser);

module.exports = router;
