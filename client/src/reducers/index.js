import { combineReducers } from "redux";
import authReducer from "./authReducer";
import memberReducer from "./memberReducer";
import newsReducer from "./newsReducer";

export default combineReducers({
  auth: authReducer,
  member: memberReducer,
  news: newsReducer,
});
