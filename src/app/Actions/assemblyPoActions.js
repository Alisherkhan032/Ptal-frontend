import {
  GET_ALL_ASSEMBLY_PO_REQUEST,
  GET_ALL_ASSEMBLY_PO_SUCCESS,
  GET_ALL_ASSEMBLY_PO_FAILURE,
  UPDATE_ASSEMBLY_PO_REQUEST,
  UPDATE_ASSEMBLY_PO_SUCCESS,
  UPDATE_ASSEMBLY_PO_FAILURE,
  GET_ALL_ASSEMBLY_PO_BY_ID_REQUEST,
  GET_ALL_ASSEMBLY_PO_BY_ID_SUCCESS,
  GET_ALL_ASSEMBLY_PO_BY_ID_FAILURE,
} from "../constants/assemblyPoConstants";

export const getAllAssemblyPoRequest = () => {
  return {
    type: GET_ALL_ASSEMBLY_PO_REQUEST,
  };
};

export const getAllAssemblyPoSuccess = (poData) => {
  return {
    type: GET_ALL_ASSEMBLY_PO_SUCCESS,
    payload: poData,
  };
};

export const getAllAssemblyPoFailure = (error) => {
  return {
    type: GET_ALL_ASSEMBLY_PO_FAILURE,
    payload: error,
  };
};

export const updateAssemblyPORequest = () => {
  return {
    type: UPDATE_ASSEMBLY_PO_REQUEST,
  };
};

export const updateAssemblyPOSuccess = (updatedPO) => {
  return {
    type: UPDATE_ASSEMBLY_PO_SUCCESS,
    payload: updatedPO,
  };
};

export const updateAssemblyPOFailure = (error) => {
  return {
    type: UPDATE_ASSEMBLY_PO_FAILURE,
    payload: error,
  };
};

export const getAssemblyPoByIdRequest = () => {
  return {
    type: GET_ALL_ASSEMBLY_PO_BY_ID_REQUEST,
  };
};

export const getAssemblyPoByIdSuccess = (poData) => {
  return {
    type: GET_ALL_ASSEMBLY_PO_BY_ID_SUCCESS,
    payload: poData,
  };
};

export const getAssemblyPoByIdFailure = (error) => {
  return {
    type: GET_ALL_ASSEMBLY_PO_BY_ID_FAILURE,
    payload: error,
  };
};
