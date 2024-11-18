import {
  SUMMARIZED_SUCCESS,
  GET_SUMMARY,
  GET_MY_LIST,
  GET_PUBLIC_LIST,
  INIT_CURRENT_ITEM,
} from "../actions/types";

const initialState = {
  selectedItem: null,
  mylist: [],
  publiclist: [],
  isNew: false,
};

function summaryReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case INIT_CURRENT_ITEM:
      return {
        ...state,
        selectedItem: null,
        isNew: false,
      };
    case SUMMARIZED_SUCCESS:
      return {
        ...state,
        selectedItem: payload.data,
        isNew: true,
      };
    case GET_SUMMARY:
      return {
        ...state,
        selectedItem: payload.data,
        isNew: false,
      };
    case GET_MY_LIST:
      return {
        ...state,
        mylist: payload.data,
      };
    case GET_PUBLIC_LIST:
      return {
        ...state,
        publiclist: payload.data,
      };
    default:
      return state;
  }
}

export default summaryReducer;
