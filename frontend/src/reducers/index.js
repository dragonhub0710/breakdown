import { combineReducers } from "redux";
import auth from "./auth";
import breakdown from "./breakdown";
import feedback from "./feedback";

export default combineReducers({
  auth,
  breakdown,
  feedback,
});
