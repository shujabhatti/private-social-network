import axios from "axios";
import {
  GET_MEMBERS,
  ADD_MEMBER,
  DELETE_MEMBER,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_MEMBER,
  FILTER_MEMBERS,
  CLEAR_MEMBERS,
  CLEAR_FILTER,
  MEMBER_ERROR,
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

// Clear Members
export const clearMembers = () => async (dispatch) => {
  dispatch({
    type: CLEAR_MEMBERS,
  });
};
// Clear On Members
export const clearOnScreenMembers = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ONSCREEN_MEMBERS,
  });
};
