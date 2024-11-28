import {
  GET_ALL_VENDOR_REQUEST,
  GET_ALL_VENDOR_SUCCESS,
  GET_ALL_VENDOR_FAILURE,
} from "../constants/vendorConstants";

export const getAllVendorRequest = () => {
  return {
    type: GET_ALL_VENDOR_REQUEST,
  };
};

export const getAllVendorSuccess = (vendorsData) => {
  return {
    type: GET_ALL_VENDOR_SUCCESS,
    payload: vendorsData,
  };
};

export const getAllVendorFailure = (error) => {
  return {
    type: GET_ALL_VENDOR_FAILURE,
    payload: error,
  };
};
