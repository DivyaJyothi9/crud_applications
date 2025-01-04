import * as types from "./actionTypes";
import axios from "axios";

const API = "http://127.0.0.1:5000";

// Action for getting users
const getUsers = (users) => ({
  type: types.GET_USERS,
  payload: users,
});

const getUser = (users) => ({
  type: types.GET_SINGLE_USER,
  payload: users,
});

// Action for adding a user
const userAdded = (msg) => ({
  type: types.ADD_USER,
  payload: msg,
});

// Action for deleting a user
const userUpdate = (msg) => ({
  type: types.DELETE_USER,
  payload: msg,
});

const userDeleted = (msg) => ({
  type: types.UPDATE_USER,
  payload: msg,
});

// Load users from the server
export const loadUsers = () => {
  return function (dispatch) {
    axios
      .get(`${API}/users`) // Corrected backticks for string interpolation
      .then((resp) => {
        dispatch(getUsers(resp.data)); // Assuming resp.data contains the list of users
      })
      .catch((err) => {
        console.error("Error loading users:", err);
      });
  };
};

// Add a new user to the server
export const addUser = (user) => {
  return function (dispatch) {
    // Ensure you're sending an array of users if backend expects a list
    const userData = Array.isArray(user) ? user : [user]; // Convert to an array if it's a single user

    axios
      .post(`${API}/users`, userData) // Corrected backticks for string interpolation
      .then((resp) => {
        dispatch(userAdded(resp.data.msg)); // Adjusted to show message after addition
        dispatch(loadUsers()); // Reload the users
      })
      .catch((err) => {
        console.error("Error adding user:", err);
      });
  };
};

// Delete a user from the server
export const deleteUser = (id) => {
  return function (dispatch) {
    axios
      .delete(`${API}/users/${id}`) // Corrected backticks for string interpolation
      .then((resp) => {
        dispatch(userDeleted(resp.data.msg)); // Dispatching deleted user message
        dispatch(loadUsers()); // Reload users after deletion
      })
      .catch((err) => {
        console.error("Error deleting user:", err);
      });
  };
};

export const loadSingleUser = (id) => {
  return function (dispatch) {
    axios
      .get(`${API}/users/${id}`) // Corrected backticks for string interpolation and changed to GET
      .then((resp) => {
        dispatch(getUser(resp.data)); // Dispatching single user data
      })
      .catch((err) => {
        console.error("Error loading user:", err);
      });
  };
};

export const updateUser = (user, id) => {
  return function (dispatch) {
    axios
      .put(`${API}/users/${id}`, user) // Corrected backticks for string interpolation
      .then((resp) => {
        dispatch(userUpdate(resp.data.msg)); // Adjusted to show message after update
        dispatch(loadUsers()); // Reload the users
      })
      .catch((err) => {
        console.error("Error updating user:", err);
      });
  };
};
