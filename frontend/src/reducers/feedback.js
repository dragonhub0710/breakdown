import {
  GET_FEEDBACK_LIST,
  CREATE_NEW_FEEDBACK,
  REJECT_FEEDBACK,
  INIT_FEEDBACK,
} from "../actions/types";

const initialState = {
  feedbackList: [],
  newFeedback: "",
  isNew: false,
};

function feedbackReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_FEEDBACK_LIST:
      return {
        ...state,
        feedbackList: payload.data,
        isNew: false,
      };
    case CREATE_NEW_FEEDBACK:
      return {
        ...state,
        newFeedback: payload.data.transcription,
        isNew: true,
      };
    case REJECT_FEEDBACK:
      return {
        ...state,
        newFeedback: "",
        isNew: false,
      };
    case INIT_FEEDBACK:
      return {
        ...state,
        newFeedback: "",
        isNew: false,
      };
    default:
      return state;
  }
}

export default feedbackReducer;
