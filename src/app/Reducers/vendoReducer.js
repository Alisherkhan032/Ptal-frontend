import {
  GET_ALL_VENDOR_REQUEST,
  GET_ALL_VENDOR_SUCCESS,
  GET_ALL_VENDOR_FAILURE,
} from "../constants/vendorConstants";

const initialState = {
  loading: false,
  allVendors: [],
  error: null,
};

export const vendorReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_VENDOR_REQUEST:
      return { ...state, loading: true, error: null, message: action.payload };

    case GET_ALL_VENDOR_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
        allVendors: action.payload,
        error: null,
      };

    case GET_ALL_VENDOR_FAILURE:
      return { ...state, loading: false, error: action.payload, message: null };

    default:
      return state;
  }
};
