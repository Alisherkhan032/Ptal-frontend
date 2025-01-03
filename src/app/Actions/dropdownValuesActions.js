import {
  GET_CATEGORY_VALUE,
  GET_VENDOR_VALUE,
  GET_MATERIAL_VALUE,
  GET_MATERIAL_NAME,
  GET_PRODUCT_VALUE,
  GET_BATCH_NUMBER,
  GET_PRODUCT_NAME,
} from "../constants/dropDownValuesConstants";

export const getCatValue = (value) => {
  return {
    type: GET_CATEGORY_VALUE,
    payload: value,
  };
};

export const getVendorValue = (value) => {
  return {
    type: GET_VENDOR_VALUE,
    payload: value,
  };
};

export const getMatValue = (value) => {
  return {
    type: GET_MATERIAL_VALUE,
    payload: value,
  };
};
export const getMatName = (value) => {
  return {
    type: GET_MATERIAL_NAME,
    payload: value,
  };
};
export const getProductValue = (value) => {
  return {
    type: GET_PRODUCT_VALUE,
    payload: value,
  };
};

export const getProductName = (productName) => {
  return {
    type: GET_PRODUCT_NAME,
    payload: productName,
  };
};

export const getBatchNumber = (batchNumber) => {
  return {
    type: GET_BATCH_NUMBER,
    payload: batchNumber,
  };
};
