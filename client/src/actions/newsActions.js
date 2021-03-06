import axios from "axios";
import {
  GET_NEWSS,
  ADD_NEWS,
  DELETE_NEWS,
  SET_CURRENT_NEWS,
  CLEAR_CURRENT_NEWS,
  UPDATE_NEWS,
  CLEAR_NEWSS,
  NEWS_ERROR,
  CLEAR_NEWS_ERROR,
  SET_ONSCREEN_NEWSS,
  CLEAR_ONSCREEN_NEWSS,
} from "./types";

// Get All News
export const getNewsList = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/news");

    dispatch({
      type: GET_NEWSS,
      payload: res.data,
    });
  } catch (err) {
    if(err.response){
      dispatch({
        type: NEWS_ERROR,
        payload: err.response.data.msg,
      });
    } else {
      dispatch({
        type: NEWS_ERROR,
        payload: err.message,
      });
    }
  }
};

// On Screen News
export const setOnScreenNews = (obj) => async (dispatch) => {
  try {
    const data = await obj;

    dispatch({
      type: SET_ONSCREEN_NEWSS,
      payload: data,
    });
  } catch (err) {
    if(err.response){
      dispatch({
        type: NEWS_ERROR,
        payload: err.response.data.msg,
      });
    } else {
      dispatch({
        type: NEWS_ERROR,
        payload: err.message,
      });
    }
  }
};

// Add News
export const addNews = (formData) => async (dispatch) => {
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
    const res = await axios.post("/api/news", form_data, config);

    dispatch({
      type: ADD_NEWS,
      payload: res.data,
    });
  } catch (err) {
    if(err.response){
      dispatch({
        type: NEWS_ERROR,
        payload: err.response.data.msg,
      });
    } else {
      dispatch({
        type: NEWS_ERROR,
        payload: err.message,
      });
    }
  }
};

// Update News
export const updateNews = (formData) => async (dispatch) => {
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
    const res = await axios.put(`/api/news/${formData._id}`, form_data, config);

    dispatch({
      type: UPDATE_NEWS,
      payload: res.data,
    });
  } catch (err) {
    if(err.response){
      dispatch({
        type: NEWS_ERROR,
        payload: err.response.data.msg,
      });
    } else {
      dispatch({
        type: NEWS_ERROR,
        payload: err.message,
      });
    }
  }
};

// Delete News
export const deleteNews = (_id) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    await axios.delete(`/api/news/${_id}`, config);

    dispatch({
      type: DELETE_NEWS,
      payload: _id,
    });
  } catch (err) {
    if(err.response){
      dispatch({
        type: NEWS_ERROR,
        payload: err.response.data.msg,
      });
    } else {
      dispatch({
        type: NEWS_ERROR,
        payload: err.message,
      });
    }
  }
};

// Set Current
export const setCurrent = (formData) => (dispatch) => {
  dispatch({
    type: SET_CURRENT_NEWS,
    payload: formData,
  });
};

// Clear Current
export const clearCurrent = () => (dispatch) => {
  dispatch({
    type: CLEAR_CURRENT_NEWS,
  });
};

// Clear News
export const clearNews = () => async (dispatch) => {
  dispatch({
    type: CLEAR_NEWSS,
  });
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_NEWS_ERROR,
  });
};

// Clear On Screen News
export const clearOnScreenNews = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ONSCREEN_NEWSS,
  });
};
