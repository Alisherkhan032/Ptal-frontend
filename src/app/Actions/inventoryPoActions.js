import {
  GET_ALL_INVENTORY_PO_REQUEST,
  GET_ALL_INVENTORY_PO_SUCCESS,
  GET_ALL_INVENTORY_PO_FAILURE,
  UPDATE_INVENTORY_PO_REQUEST,
  UPDATE_INVENTORY_PO_SUCCESS,
  UPDATE_INVENTORY_PO_FAILURE,
  GET_INVENTORY_POBYID_REQUEST,
  GET_INVENTORY_POBYID_SUCCESS,
  GET_INVENTORY_POBYID_FAILURE,
} from "../constants/inventoryPoConstants";

export const getAllInventoryPoRequest = () => {
  return {
    type: GET_ALL_INVENTORY_PO_REQUEST,
  };
};

export const getAllInventoryPoSuccess = (poData) => {
  return {
    type: GET_ALL_INVENTORY_PO_SUCCESS,
    payload: poData,
  };
};

export const getAllInventoryPoFailure = (error) => {
  return {
    type: GET_ALL_INVENTORY_PO_FAILURE,
    payload: error,
  };
};

export const getInventoryPobByIdRequest = () => {
  return {
    type: GET_INVENTORY_POBYID_REQUEST,
  };
};

export const getInventoryPobByIdSuccess = (poData) => {
  return {
    type: GET_INVENTORY_POBYID_SUCCESS,
    payload: poData,
  };
};

export const getInventoryPobByIdFailure = (error) => {
  return {
    type: GET_INVENTORY_POBYID_FAILURE,
    payload: error,
  };
};

export const updateInventoryPORequest = () => {
  return {
    type: UPDATE_INVENTORY_PO_REQUEST,
  };
};

export const updateInventoryPOSuccess = (updatedPO) => {
  return {
    type: UPDATE_INVENTORY_PO_SUCCESS,
    payload: updatedPO,
  };
};

export const updateInventoryPOFailure = (error) => {
  return {
    type: UPDATE_INVENTORY_PO_FAILURE,
    payload: error,
  };
};
