import {
  CREATE_NEW_BREAKDOWN,
  GET_ONE_BREAKDOWN,
  GET_MY_LIST,
  GET_PUBLIC_LIST,
  INIT_CURRENT_BREAKDOWN,
  SET_SHARE_BREAKDOWN,
  UPDATE_BREAKDOWN,
  SAVE_UPDATED_BREAKDOWN,
} from "../actions/types";

const initialState = {
  selectedBD: null,
  myList: [],
  publicList: [],
  isNew: false,
};

function breakdownReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case INIT_CURRENT_BREAKDOWN:
      return {
        ...state,
        selectedBD: null,
        isNew: false,
      };
    case CREATE_NEW_BREAKDOWN:
      return {
        ...state,
        selectedBD: payload.data,
        isNew: true,
      };
    case UPDATE_BREAKDOWN:
      return {
        ...state,
        selectedBD: payload.data,
      };
    case GET_ONE_BREAKDOWN:
      return {
        ...state,
        selectedBD: payload.data,
        isNew: false,
      };
    case GET_MY_LIST:
      return {
        ...state,
        myList: payload.data,
      };
    case GET_PUBLIC_LIST:
      return {
        ...state,
        publicList: payload.data,
      };
    case SET_SHARE_BREAKDOWN:
      return {
        ...state,
        selectedBD: payload.data,
      };
    default:
      return state;
  }
}

export default breakdownReducer;
