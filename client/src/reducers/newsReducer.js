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
} from "../actions/types";

const initialState = {
  records: null,
  onscreenrecords: [],
  current: null,
  filtered: null,
  returnmessage: "",
  error: null,
  loading: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_NEWSS:
      return {
        ...state,
        records: action.payload,
        onscreenrecords: action.payload,
        loading: false,
      };
    case SET_ONSCREEN_NEWSS:
      return {
        ...state,
        onscreenrecords: action.payload,
        loading: false,
      };
    case ADD_NEWS:
      return {
        ...state,
        records: [action.payload, ...state.records],
        returnmessage: "News added!",
        loading: false,
      };
    case UPDATE_NEWS:
      return {
        ...state,
        records: state.records.map((news) =>
          news._id === action.payload._id ? action.payload : news
        ),
        returnmessage: "News updated!",
        loading: false,
      };
    case DELETE_NEWS:
      const filteredrecords = state.records.filter(
        (news) => news._id !== action.payload
      );
      return {
        ...state,
        records: filteredrecords,
        onscreenrecords: filteredrecords,
        returnmessage: "News deleted!",
        loading: false,
      };
    case SET_CURRENT_NEWS:
      return {
        ...state,
        current: action.payload,
      };
    case CLEAR_CURRENT_NEWS:
      return {
        ...state,
        current: null,
      };
    case CLEAR_ONSCREEN_NEWSS:
      return {
        ...state,
        onscreenrecords: [],
      };
    case CLEAR_NEWSS:
      return {
        ...state,
        records: null,
        filtered: null,
        error: null,
        current: null,
      };
    case NEWS_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_NEWS_ERROR:
      return {
        ...state,
        error: null,
        returnmessage: "",
      };
    default:
      return state;
  }
};
