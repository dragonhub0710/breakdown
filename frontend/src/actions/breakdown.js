import api from "../utils/api";
import {
  CREATE_NEW_BREAKDOWN,
  GET_ONE_BREAKDOWN,
  GET_MY_LIST,
  GET_PUBLIC_LIST,
  INIT_CURRENT_BREAKDOWN,
  UPDATE_BREAKDOWN,
} from "./types";

export const recordBreakdown = (data) => async (dispatch) => {
  try {
    const res = await api.post("/record", data, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    dispatch({
      type: CREATE_NEW_BREAKDOWN,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

export const saveNewBreakdown = (data) => async (dispatch) => {
  try {
    const res = await api.post("/breakdown", data);
    dispatch({
      type: CREATE_NEW_BREAKDOWN,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

export const initCurrentBreakdown = () => async (dispatch) => {
  dispatch({
    type: INIT_CURRENT_BREAKDOWN,
  });
};

export const getMyList = () => async (dispatch) => {
  try {
    const res = await api.get("/breakdown");
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
    const res = await api.get("/breakdown/public");

    dispatch({
      type: GET_PUBLIC_LIST,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

export const recordUpdateBreakdown = (data) => async (dispatch) => {
  try {
    const res = await api.post("/record/update", data, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    dispatch({
      type: UPDATE_BREAKDOWN,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

export const updateBreakdown = (data) => async (dispatch) => {
  try {
    const res = await api.put("/breakdown", data);
    dispatch({
      type: UPDATE_BREAKDOWN,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

export const getOneBreakdown = (data) => async (dispatch) => {
  try {
    const res = await api.get(`/breakdown/${data.shareId}`);

    dispatch({
      type: GET_ONE_BREAKDOWN,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};

export const deleteBreakdown = (data) => async (dispatch) => {
  try {
    const res = await api.delete(`/breakdown/${data.id}`);
    dispatch({
      type: GET_MY_LIST,
      payload: res.data,
    });
  } catch (err) {
    throw err;
  }
};
