const db = require("../database"); // Make sure the path is correct
const argon2 = require("argon2");

// Select all users from the database.
exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.user.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving users" });
  }
};

// Select one user from the database by ID.
exports.getUserById = async (req, res) => {
  try {
    const user = await db.user.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error retrieving user" });
  }
};

// User login implementation.
exports.login = async (req, res) => {
  try {
    const user = await db.user.findOne({
      where: { username: req.body.username },
    });
    if (user && (await argon2.verify(user.password_hash, req.body.password))) {
      res.json(user);
    } else {
      res.status(401).send({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error during login" });
  }
};

// Create a user in the database.
exports.createUser = async (req, res) => {
  try {
    const hash = await argon2.hash(req.body.password, {
      type: argon2.argon2id,
    });
    const user = await db.user.create({
      username: req.body.username,
      email: req.body.email, // Ensure the email is included in the request
      password_hash: hash,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).send({ message: "Error creating user" });
  }
};

// Update a user in the database
exports.updateUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await db.user.findByPk(id);
    if (!user) {
      res.status(404).send({ message: "User not found!" });
      return;
    }
    const updatedUser = await user.update(req.body);
    res.send(updatedUser);
  } catch (error) {
    res.status(500).send({ message: "Error updating user with id=" + id });
  }
};

// Delete a user from the database
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const deleteCount = await db.user.destroy({
      where: { user_id: id },
    });
    if (deleteCount > 0) {
      res.send({ message: "User deleted successfully!" });
    } else {
      res.status(404).send({ message: "User not found!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Could not delete user with id=" + id });
  }
};
