import api from "../utils/api";
import {
  SUMMARIZED_SUCCESS,
  GET_ALL_SUMMARIES,
  GET_ONE_SUMMARY,
  UPDATE_SUMMARY,
  SELECTED_SUMMARY,
} from "./types";

export const recordSummarize = (data) => async (dispatch) => {
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
    dispatch({
      type: GET_ONE_SUMMARY,
      payload: { data: res.data.data[0] },
    });
  } catch (err) {
    throw err;
  }
};

export const updateRecordSummarize = (data) => async (dispatch) => {
  try {
    const res = await api.post("/record/update", data, {
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

export const getAllSummaries = () => async (dispatch) => {
  try {
    const res = await api.get("/summary");
    dispatch({
      type: GET_ALL_SUMMARIES,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

export const getOneSummary = (data) => async (dispatch) => {
  try {
    const res = await api.get(`/summary/${data.id}`);
    dispatch({
      type: GET_ONE_SUMMARY,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

export const updateSummary = (data) => async (dispatch) => {
  try {
    const res = await api.post(`/summary/update/${data.id}`, data);
    dispatch({
      type: UPDATE_SUMMARY,
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
      type: UPDATE_SUMMARY,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

export const selectedSummary = (data) => async (dispatch) => {
  try {
    dispatch({
      type: SELECTED_SUMMARY,
      payload: data,
    });
  } catch (err) {
    throw err;
  }
};
