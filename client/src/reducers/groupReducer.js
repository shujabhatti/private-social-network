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
} from "../actions/types";

const initialState = {
  records: [],
  onscreenrecords: [],
  current: null,
  filtered: null,
  returnmessage: "",
  error: null,
  loading: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_GROUPS:
      return {
        ...state,
        records: action.payload,
        onscreenrecords: action.payload,
        loading: false,
      };
    case SET_ONSCREEN_GROUPS:
      return {
        ...state,
        onscreenrecords: action.payload,
        loading: false,
      };
    case ADD_GROUP:
      return {
        ...state,
        records: [action.payload, ...state.records],
        returnmessage: "Group added!",
        loading: false,
      };
    case UPDATE_GROUP:
      return {
        ...state,
        records: state.records.map((group) =>
          group._id === action.payload._id ? action.payload : group
        ),
        returnmessage: "Group updated!",
        loading: false,
      };
    case DELETE_GROUP:
      const filteredrecords = state.records.filter(
        (group) => group._id !== action.payload
      );
      return {
        ...state,
        records: filteredrecords,
        onscreenrecords: filteredrecords,
        returnmessage: "Group deleted!",
        loading: false,
      };
    case SET_CURRENT_GROUP:
      return {
        ...state,
        current: action.payload,
      };
    case CLEAR_CURRENT_GROUP:
      return {
        ...state,
        current: null,
      };
    case CLEAR_ONSCREEN_GROUPS:
      return {
        ...state,
        onscreenrecords: [],
      };
    case CLEAR_GROUPS:
      return {
        ...state,
        records: null,
        filtered: null,
        error: null,
        current: null,
      };
    case GROUP_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_GROUP_ERROR:
      return {
        ...state,
        error: null,
        returnmessage: "",
      };
    default:
      return state;
  }
};
