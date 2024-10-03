import {
  SUMMARIZED_SUCCESS,
  GET_ALL_SUMMARIES,
  GET_ONE_SUMMARY,
  UPDATE_SUMMARY,
  SELECTED_SUMMARY,
} from "../actions/types";

const initialState = {
  selectedOne: null,
  list: null,
};

function summaryReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SUMMARIZED_SUCCESS:
    case GET_ALL_SUMMARIES:
    case UPDATE_SUMMARY:
      return {
        ...state,
        list: payload.data,
      };
    case GET_ONE_SUMMARY:
      return {
        ...state,
        selectedOne: payload.data,
      };
    case SELECTED_SUMMARY:
      return {
        ...state,
        selectedOne: payload,
      };
    default:
      return state;
  }
}

export default summaryReducer;
