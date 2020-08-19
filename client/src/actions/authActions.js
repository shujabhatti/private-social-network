import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_FAIL,
  CLEAR_CHANGE_PASSWORD,
  LOGOUT,
  CLEAR_ERRORS,
} from "./types";

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("/api/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

// Register User
export const register = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post("/api/users", formData, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    loadUser();
  } catch (err) {
    dispatch({
      type: REGISTER_FAIL,
      payload: err.response.data.msg,
    });
  }
};

// Login User
export const login = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post("/api/auth", formData, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    loadUser();
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: err.response.data.msg,
    });
  }
};

// Change User Password
export const changePassword = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.put("/api/users/change-password", formData, config);

    dispatch({
      type: CHANGE_PASSWORD,
      payload: res.data,
    });

    console.log(res.data);
  } catch (err) {
    dispatch({
      type: CHANGE_PASSWORD_FAIL,
      payload: err.response.data.msg,
    });
    console.log(err.response.data.msg);
  }
};

// Logout
export const logout = () => (dispatch) => dispatch({ type: LOGOUT });

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};

// Clear Errors
export const clearChangePassword = () => async (dispatch) => {
  dispatch({
    type: CLEAR_CHANGE_PASSWORD,
  });
};