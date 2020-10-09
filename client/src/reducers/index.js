import { combineReducers } from "redux";
import authReducer from "./authReducer";
import memberReducer from "./memberReducer";
import newsReducer from "./newsReducer";
import groupReducer from "./groupReducer";

export default combineReducers({
  auth: authReducer,
  member: memberReducer,
  news: newsReducer,
  groups: groupReducer,
});
