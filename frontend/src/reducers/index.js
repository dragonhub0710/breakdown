import { combineReducers } from "redux";
import auth from "./auth";
import summary from "./summary";

export default combineReducers({
  auth,
  summary,
});
