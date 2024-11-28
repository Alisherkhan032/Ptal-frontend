import {
  GET_ALL_PICKLIST_REQUEST,
  GET_ALL_PICKLIST_SUCCESS,
  GET_ALL_PICKLIST_FAILURE,
  GET_PICKLIST_BYID_FAILURE,
  GET_PICKLIST_BYID_REQUEST,
  GET_PICKLIST_BYID_SUCCESS,
} from "../constants/pickListContants";

export const getAllPickListRequest = () => {
  return {
    type: GET_ALL_PICKLIST_REQUEST,
  };
};

export const getAllPickListSuccess = (pickListData) => {
  return {
    type: GET_ALL_PICKLIST_SUCCESS,
    payload: pickListData,
  };
};

export const getAllPickListFailure = (error) => {
  return {
    type: GET_ALL_PICKLIST_FAILURE,
    payload: error,
  };
};

export const getPickListByIdRequest = () => {
  return {
    type: GET_PICKLIST_BYID_REQUEST,
  };
};

export const getPickListByIdSuccess = (pickListData) => {
  return {
    type: GET_PICKLIST_BYID_SUCCESS,
    payload: pickListData,
  };
};

export const getPickListByIdFailure = (error) => {
  return {
    type: GET_PICKLIST_BYID_FAILURE,
    payload: error,
  };
};
