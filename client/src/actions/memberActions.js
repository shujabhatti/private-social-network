import axios from "axios";
import {
  GET_MEMBERS,
  ADD_MEMBER,
  DELETE_MEMBER,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_MEMBER,
  UPDATE_IMAGE,
  CLEAR_MEMBERS,
  MEMBER_ERROR,
  CLEAR_MEMBER_ERROR,
  SET_ONSCREEN_MEMBERS,
  CLEAR_ONSCREEN_MEMBERS,
} from "./types";

// Get Members
export const getMembers = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/members");

    dispatch({
      type: GET_MEMBERS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: MEMBER_ERROR,
      payload: err.response.msg,
    });
  }
};

// On Screen Members
export const setOnScreenMembers = (obj) => async (dispatch) => {
  try {
    const data = await obj;

    dispatch({
      type: SET_ONSCREEN_MEMBERS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: MEMBER_ERROR,
      payload: err.response.statusText,
    });
  }
};

// Add Member
export const addMember = (formData) => async (dispatch) => {
  const form_data = new FormData();

  for (var key in formData) {
    form_data.append(key, formData[key]);
    console.log(key, formData[key]);
  }

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  try {
    const res = await axios.post("/api/members", form_data, config);

    dispatch({
      type: ADD_MEMBER,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: MEMBER_ERROR,
      payload: err.response.data.msg,
    });
  }
};

// Update Member
export const updateMember = (formData) => async (dispatch) => {
  const form_data = new FormData();

  for (var key in formData) {
    form_data.append(key, formData[key]);
    console.log(key, formData[key]);
  }

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  try {
    const res = await axios.put(
      `/api/members/${formData._id}`,
      form_data,
      config
    );

    dispatch({
      type: UPDATE_MEMBER,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: MEMBER_ERROR,
      payload: err.response.data.msg,
    });
  }
};

// Update member Image
export const updateImage = (id, imgObj) => async (dispatch) => {
  const form_data = new FormData();

  for (var key in imgObj) {
    form_data.append(key, imgObj[key]);
  }

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  try {
    const res = await axios.put(
      `/api/members/change-profile/${id}`,
      form_data,
      config
    );

    dispatch({
      type: UPDATE_IMAGE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: MEMBER_ERROR,
      payload: err.response.data.msg,
    });
  }
};

// Change Member Password
export const changePassword = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.put(
      `/api/members/change-password/${formData._id}`,
      formData,
      config
    );

    dispatch({
      type: UPDATE_MEMBER,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: MEMBER_ERROR,
      payload: err.response.data.msg,
    });
  }
};

// Delete Member
export const deleteMember = (_id) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    await axios.delete(`/api/members/${_id}`, config);

    dispatch({
      type: DELETE_MEMBER,
      payload: _id,
    });
  } catch (err) {
    dispatch({
      type: MEMBER_ERROR,
      payload: err.response.msg,
    });
  }
};

// Set Current
export const setCurrent = (formData) => (dispatch) => {
  dispatch({
    type: SET_CURRENT,
    payload: formData,
  });
};
// Clear Current
export const clearCurrent = () => (dispatch) => {
  dispatch({
    type: CLEAR_CURRENT,
  });
};

// Clear Members
export const clearMembers = () => async (dispatch) => {
  dispatch({
    type: CLEAR_MEMBERS,
  });
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_MEMBER_ERROR,
  });
};

// Clear On Members
export const clearOnScreenMembers = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ONSCREEN_MEMBERS,
  });
};
