import api from "../utils/api";
import {
  SUMMARIZED_SUCCESS,
  GET_SUMMARY,
  GET_MY_LIST,
  GET_PUBLIC_LIST,
  INIT_CURRENT_ITEM,
} from "./types";

export const summarize = (data) => async (dispatch) => {
  try {
    const res = await api.post("/record", data, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    dispatch({
      type: SUMMARIZED_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

export const initCurrentItem = () => async (dispatch) => {
  dispatch({
    type: INIT_CURRENT_ITEM,
  });
};

export const getMyList = () => async (dispatch) => {
  try {
    const res = await api.get("/summary");
    dispatch({
      type: GET_MY_LIST,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

export const getPublicList = () => async (dispatch) => {
  try {
    const res = await api.get("/summary/public");
    dispatch({
      type: GET_PUBLIC_LIST,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

export const createNewSummary = (data) => async (dispatch) => {
  try {
    const res = await api.post("/summary", data);
    dispatch({
      type: GET_SUMMARY,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

export const updateSummary = (data) => async (dispatch) => {
  try {
    const res = await api.put("/summary", data);
    dispatch({
      type: GET_SUMMARY,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

export const getSummary = (data) => async (dispatch) => {
  try {
    const res = await api.get(`/summary/${data.id}`);
    dispatch({
      type: GET_SUMMARY,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

export const removeSummary = (data) => async (dispatch) => {
  try {
    const res = await api.delete(`/summary/${data.id}`);
    dispatch({
      type: GET_MY_LIST,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};
