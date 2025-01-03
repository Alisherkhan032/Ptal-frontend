import {
  GET_ALL_PO_REQUEST,
  GET_ALL_PO_SUCCESS,
  GET_ALL_PO_FAILURE,
  UPDATE_PO_REQUEST,
  UPDATE_PO_SUCCESS,
  UPDATE_PO_FAILURE,
  GET_PO_BYID_FAILURE,
  GET_PO_BYID_REQUEST,
  GET_PO_BYID_SUCCESS,
} from "../constants/poConstants";

export const getAllPoRequest = () => {
  return {
    type: GET_ALL_PO_REQUEST,
  };
};

export const getAllPoSuccess = (poData) => {
  return {
    type: GET_ALL_PO_SUCCESS,
    payload: poData,
  };
};

export const getAllPoFailure = (error) => {
  return {
    type: GET_ALL_PO_FAILURE,
    payload: error,
  };
};

export const updatePORequest = () => {
  return {
    type: UPDATE_PO_REQUEST,
  };
};

export const updatePOSuccess = (updatedPO) => {
  return {
    type: UPDATE_PO_SUCCESS,
    payload: updatedPO,
  };
};

export const updatePOFailure = (error) => {
  return {
    type: UPDATE_PO_FAILURE,
    payload: error,
  };
};

  export const getPoByIdRequest = () => {
    return {
      type: GET_PO_BYID_REQUEST,
    };
  };
  
  export const getPoByIdSuccess = (poData) => {
    return {
      type: GET_PO_BYID_SUCCESS,
      payload: poData,
    };
  };
  
  export const getPoByIdFailure = (error) => {
    return {
      type: GET_PO_BYID_FAILURE,
      payload: error,
    };
  };
