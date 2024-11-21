import api from "../utils/api";
import {
  CREATE_NEW_FEEDBACK,
  GET_ONE_BREAKDOWN,
  GET_FEEDBACK_LIST,
  REJECT_FEEDBACK,
  INIT_FEEDBACK,
} from "./types";

export const recordFeedback = (data) => async (dispatch) => {
  try {
    const res = await api.post("/record", data, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    dispatch({
      type: CREATE_NEW_FEEDBACK,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

export const createFeedback = (data) => async (dispatch) => {
  try {
    const res = await api.post("/feedback", data);
    const updatedBreakdownRes = await api.get(`/breakdown/${data.shareId}`);
    dispatch({
      type: GET_ONE_BREAKDOWN,
      payload: updatedBreakdownRes.data,
    });
  } catch (err) {
    throw err;
  }
};

export const approveFeedback = (data) => async (dispatch) => {
  try {
    const res = await api.post(`/feedback/approve`, data);

    dispatch({
      type: GET_FEEDBACK_LIST,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

export const initFeedback = () => async (dispatch) => {
  dispatch({
    type: INIT_FEEDBACK,
  });
};

export const deleteFeedback = (data) => async (dispatch) => {
  try {
    const res = await api.post(`/feedback/delete`, data);

    dispatch({
      type: GET_FEEDBACK_LIST,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

export const rejectFeedback = () => async (dispatch) => {
  try {
    dispatch({
      type: REJECT_FEEDBACK,
    });
  } catch (err) {
    throw err;
  }
};

export const getFeedbackList = (data) => async (dispatch) => {
  try {
    const res = await api.get(`/feedback/${data.breakdownId}`);
    dispatch({
      type: GET_FEEDBACK_LIST,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};
