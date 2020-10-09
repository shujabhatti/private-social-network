import axios from "axios";
import {
  GET_GROUPS,
  ADD_GROUP,
  DELETE_GROUP,
  SET_CURRENT_GROUP,
  CLEAR_CURRENT_GROUP,
  UPDATE_GROUP,
  CLEAR_GROUPS,
  GROUP_ERROR,
  CLEAR_GROUP_ERROR,
  SET_ONSCREEN_GROUPS,
  CLEAR_ONSCREEN_GROUPS,
} from "./types";

// Get All Groups
export const getGroupsList = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/groups");

    dispatch({
      type: GET_GROUPS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: err.response.msg,
    });
  }
};

// On Screen Group
export const setOnScreenGroups = (obj) => async (dispatch) => {
  try {
    const data = await obj;

    dispatch({
      type: SET_ONSCREEN_GROUPS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: err.response.statusText,
    });
  }
};

// Add Group
export const addGroup = (formData) => async (dispatch) => {
  const form_data = new FormData();

  for (var key in formData) {
    form_data.append(key, formData[key]);
  }

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  try {
    const res = await axios.post("/api/groups", form_data, config);

    dispatch({
      type: ADD_GROUP,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: err.response.data.msg,
    });
  }
};

// Update Group
export const updateGroup = (formData) => async (dispatch) => {
  const form_data = new FormData();

  for (var key in formData) {
    form_data.append(key, formData[key]);
  }

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  try {
    const res = await axios.put(
      `/api/groups/${formData._id}`,
      form_data,
      config
    );

    dispatch({
      type: UPDATE_GROUP,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: err.response.data.msg,
    });
  }
};

// Delete Group
export const deleteGroup = (_id) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    await axios.delete(`/api/groups/${_id}`, config);

    dispatch({
      type: DELETE_GROUP,
      payload: _id,
    });
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: err.response.msg,
    });
  }
};

// Set Current
export const setCurrent = (formData) => (dispatch) => {
  dispatch({
    type: SET_CURRENT_GROUP,
    payload: formData,
  });
};

// Clear Current
export const clearCurrent = () => (dispatch) => {
  dispatch({
    type: CLEAR_CURRENT_GROUP,
  });
};

// Clear Groups
export const clearGroups = () => async (dispatch) => {
  dispatch({
    type: CLEAR_GROUPS,
  });
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_GROUP_ERROR,
  });
};

// Clear On Screen Groups
export const clearOnScreenGroups = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ONSCREEN_GROUPS,
  });
};
