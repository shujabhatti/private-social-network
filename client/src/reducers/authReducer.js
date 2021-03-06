import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  UPDATE_USER,
  UPDATE_ERROR,
  LOGIN_FAIL,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_FAIL,
  CLEAR_CHANGE_PASSWORD,
  LOGOUT,
  CLEAR_ERRORS,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  returnmessage: "",
  user: {},
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: {},
        error: action.payload,
      };
    case UPDATE_USER:
      return {
        ...state,
        returnmessage: action.payload.msg,
        loading: false,
      };
    case CHANGE_PASSWORD:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: {},
        returnmessage: action.payload.msg,
      };
    case CLEAR_CHANGE_PASSWORD:
      return {
        ...state,
        returnmessage: "",
      };
    case CHANGE_PASSWORD_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        returnmessage: "",
        error: null,
      };
    default:
      return state;
  }
};
