import {
  GET_ALL_MATERIAL_REQUEST,
  GET_ALL_MATERIAL_SUCCESS,
  GET_ALL_MATERIAL_FAILURE,
  GET_ALL_MATERIAL_BYCATEID_REQUEST,
  GET_ALL_MATERIAL_BYCATEID_SUCCESS,
  GET_ALL_MATERIAL_BYCATEID_FAILURE,
} from "../constants/materialConstants";

export const getAllMaterialRequest = () => {
  return {
    type: GET_ALL_MATERIAL_REQUEST,
  };
};

export const getAllMaterialSuccess = (materialsData) => {
  return {
    type: GET_ALL_MATERIAL_SUCCESS,
    payload: materialsData,
  };
};

export const getAllMaterialFailure = (error) => {
  return {
    type: GET_ALL_MATERIAL_FAILURE,
    payload: error,
  };
};

export const getAllMaterialByCatIdRequest = () => {
  return {
    type: GET_ALL_MATERIAL_BYCATEID_REQUEST,
  };
};

export const getAllMaterialByCatIdSuccess = (materialsData) => {
  return {
    type: GET_ALL_MATERIAL_BYCATEID_SUCCESS,
    payload: materialsData,
  };
};

export const getAllMaterialByCatIdFailure = (error) => {
  return {
    type: GET_ALL_MATERIAL_BYCATEID_FAILURE,
    error: error,
  };
};
