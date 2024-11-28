import {
  GET_ALL_PRODUCT_REQUEST,
  GET_ALL_PRODUCT_SUCCESS,
  GET_ALL_PRODUCT_FAILURE,
  GET_ALL_PRODUCT_BYCATEID_REQUEST,
  GET_ALL_PRODUCT_BYCATEID_SUCCESS,
  GET_ALL_PRODUCT_BYCATEID_FAILURE,
  GET_PRODUCT_BYID_REQUEST,
  GET_PRODUCT_BYID_FAILURE,
  GET_PRODUCT_BYID_SUCCESS,
} from '../constants/productConstants';

export const getAllProductRequest = () => {
  return {
    type: GET_ALL_PRODUCT_REQUEST,
  };
};

export const getAllProductSuccess = (materialsData) => {
  return {
    type: GET_ALL_PRODUCT_SUCCESS,
    payload: materialsData,
  };
};

export const getAllProductFailure = (error) => {
  return {
    type: GET_ALL_PRODUCT_FAILURE,
    payload: error,
  };
};

export const getAllProductByCatIdRequest = () => {
  return {
    type: GET_ALL_PRODUCT_BYCATEID_REQUEST,
  };
};

export const getAllProductByCatIdSuccess = (materialsData) => {
  return {
    type: GET_ALL_PRODUCT_BYCATEID_SUCCESS,
    payload: materialsData,
  };
};

export const getAllProductByCatIdFailure = (error) => {
  return {
    type: GET_ALL_PRODUCT_BYCATEID_FAILURE,
    error: error,
  };
};

export const getProductByIdRequest = () => {
  return {
    type: GET_PRODUCT_BYID_REQUEST,
  };
};

export const getProductByIdSuccess = (productDetail) => {
  return {
    type: GET_PRODUCT_BYID_SUCCESS,
    payload: productDetail,
  };
};

export const getProductByIdFailure = (error) => {
  return {
    type: GET_PRODUCT_BYID_FAILURE,
    error: error,
  };
};
