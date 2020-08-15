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
} from "../actions/types";

const initialState = {
  members: null,
  onscreenmembers: [],
  current: null,
  filtered: null,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_MEMBERS:
      return {
        ...state,
        members: action.payload,
        onscreenmembers: action.payload,
        loading: false,
      };
    case SET_ONSCREEN_MEMBERS:
      return {
        ...state,
        onscreenmembers: action.payload,
        loading: false,
      };
    case CLEAR_ONSCREEN_MEMBERS:
      return {
        ...state,
        onscreenmembers: [],
      };
    case CLEAR_MEMBERS:
      return {
        ...state,
        members: null,
        filtered: null,
        error: null,
        current: null,
      };
    case MEMBER_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
