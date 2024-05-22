import axios from "axios";

// --- Constants ----------------------------------------------------------------------------------
const API_HOST = "http://localhost:4000";
const USER_KEY = "user";

// --- User ---------------------------------------------------------------------------------------
async function verifyUser(username, password) {
  const response = await axios.post(API_HOST + "/api/users/login", {
    username,
    password,
  });
  const user = response.data;

  // NOTE: In this example the login is also persistent as it is stored in local storage.
  if (user !== null) setUser(user);

  return user;
}

async function findUser(id) {
  const response = await axios.get(API_HOST + `/api/users/${id}`);
  return response.data;
}

async function createUser(user) {
  try {
    const response = await axios.post(`${API_HOST}/api/users`, user);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data.message);
    }
    throw new Error("An error occurred while creating the user.");
  }
}

async function updateUser(userId, userData) {
  try {
    const response = await axios.put(
      `${API_HOST}/api/users/${userId}`,
      userData
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("User not found!");
    }
    throw new Error("An error occurred while updating the user.");
  }
}

async function deleteUser(id) {
  const response = await axios.delete(API_HOST + `/api/users/${id}`);
  return response.data;
}

async function verifyPassword(userId, password) {
  const response = await axios.post(API_HOST + "/api/users/verify-password", {
    userId,
    password,
  });
  return response.data;
}

async function changePassword(userId, currentPassword, newPassword) {
  const response = await axios.put(
    `${API_HOST}/api/users/${userId}/change-password`,
    {
      currentPassword,
      newPassword,
    }
  );
  return response.data;
}

// --- Helper functions to interact with local storage --------------------------------------------
function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getUser() {
  return JSON.parse(localStorage.getItem(USER_KEY));
}

function removeUser() {
  localStorage.removeItem(USER_KEY);
}

// --- Product Functions --------------------------------------------------------------------------
async function fetchProducts() {
  const response = await axios.get(`${API_HOST}/api/products`);
  return response.data;
}

export {
  verifyUser,
  findUser,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  setUser,
  removeUser,
  verifyPassword,
  changePassword,
  fetchProducts,
};
