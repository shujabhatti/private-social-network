import {
  GET_MEMBERS,
  ADD_MEMBER,
  DELETE_MEMBER,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_MEMBER,
  CLEAR_MEMBERS,
  MEMBER_ERROR,
  CLEAR_MEMBER_ERROR,
  SET_ONSCREEN_MEMBERS,
  CLEAR_ONSCREEN_MEMBERS,
} from "../actions/types";

const initialState = {
  members: null,
  onscreenmembers: [],
  current: null,
  filtered: null,
  returnmessage: "",
  error: null,
  loading: true,
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
    case ADD_MEMBER:
      return {
        ...state,
        members: [action.payload, ...state.members],
        returnmessage: "Member added successfully...!",
        loading: false,
      };
    case UPDATE_MEMBER:
      return {
        ...state,
        members: state.members.map((member) =>
          member._id === action.payload._id ? action.payload : member
        ),
        returnmessage: "Member updated successfully...!",
        loading: false,
      };
    case DELETE_MEMBER:
      const filteredMembers = state.members.filter(
        (member) => member._id !== action.payload
      );
      return {
        ...state,
        members: filteredMembers,
        onscreenmembers: filteredMembers,
        returnmessage: "Member deleted successfully...!",
        loading: false,
      };
    case SET_CURRENT:
      return {
        ...state,
        current: action.payload,
      };
    case CLEAR_CURRENT:
      return {
        ...state,
        current: null,
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
    case CLEAR_MEMBER_ERROR:
      return {
        ...state,
        error: null,
        returnmessage: "",
      };
    default:
      return state;
  }
};
