import {
 GET_ORDER_DETAILS_BY_REFERENCE_CODE_FAILURE,
 GET_ORDER_DETAILS_BY_REFERENCE_CODE_REQUEST,
 GET_ORDER_DETAILS_BY_REFERENCE_CODE_SUCCESS,
 GET_ALL_ORDER_DETAILS_REQUEST,
 GET_ALL_ORDER_DETAILS_SUCCESS,
 GET_ALL_ORDER_DETAILS_FAILURE,
} from '../constants/orderDetailsConstants';


export const getAllOrderDetailsRequest = () => {
    return {
      type: GET_ALL_ORDER_DETAILS_REQUEST,
    };
};

export const getAllOrderDetailsSuccess = (ordersData) => {
    return {
      type: GET_ALL_ORDER_DETAILS_SUCCESS,
      payload: ordersData,
    };
}

export const getAllOrderDetailsFailure = (error) => {
    return {
      type: GET_ALL_ORDER_DETAILS_FAILURE,
      payload: error,
    };
}

export const getOrderDetailsByReferenceCodeRequest = () => {
    return {
      type: GET_ORDER_DETAILS_BY_REFERENCE_CODE_REQUEST,
    };
  };
  
  export const getOrderDetailsByReferenceCodeSuccess = (ordersData) => {
    return {
      type: GET_ORDER_DETAILS_BY_REFERENCE_CODE_SUCCESS,
      payload: ordersData,
    };
  };
  
  export const getOrderDetailsByReferenceCodeFailure = (error) => {
    return {
      type: GET_ORDER_DETAILS_BY_REFERENCE_CODE_FAILURE,
      payload: error,
    };
  };