import {
  GET_ALL_AMAZON_ORDERS_REQUEST,
  GET_ALL_AMAZON_ORDERS_SUCCESS,
  GET_ALL_AMAZON_ORDERS_FAILURE,
  GET_ORDERBY_ORDERID_REQUEST,
  GET_ORDERBY_ORDERID_FAILURE,
  GET_ORDERBY_ORDERID_SUCCESS,
  GET_ALL_OPEN_ORDERS_FAILURE,
  GET_ALL_OPEN_ORDERS_REQUEST,
  GET_ALL_OPEN_ORDERS_SUCCESS,
  GET_ALL_CUSTOM_ORDERS_FAILURE,
  GET_ALL_CUSTOM_ORDERS_REQUEST,
  GET_ALL_CUSTOM_ORDERS_SUCCESS,
} from "../constants/orderConstants";

export const getAllAmazonOrdersRequest = () => {
  return {
    type: GET_ALL_AMAZON_ORDERS_REQUEST,
  };
};

export const getAllAmazonOrdersSuccess = (ordersData) => {
  return {
    type: GET_ALL_AMAZON_ORDERS_SUCCESS,
    payload: ordersData,
  };
};

export const getAllAmazonOrdersFailure = (error) => {
  return {
    type: GET_ALL_AMAZON_ORDERS_FAILURE,
    payload: error,
  };
};

export const getAllCustomOrdersRequest = () => {
  return {
    type: GET_ALL_CUSTOM_ORDERS_REQUEST,
  };
}

export const getAllCustomOrdersSuccess = (ordersData) => {
  return {
    type: GET_ALL_CUSTOM_ORDERS_SUCCESS,
    payload: ordersData,
  };
}

export const getAllCustomOrdersFailure = (error) => {
  return {
    type: GET_ALL_CUSTOM_ORDERS_FAILURE,
    payload: error,
  };
}

export const getOrderByOrderIdRequest = () => {
  return {
    type: GET_ORDERBY_ORDERID_REQUEST,
  };
};

export const getOrderByOrderIdSuccess = (ordersData) => {
  return {
    type: GET_ORDERBY_ORDERID_SUCCESS,
    payload: ordersData,
  };
};

export const getOrderByOrderIdFailure = (error) => {
  return {
    type: GET_ORDERBY_ORDERID_FAILURE,
    payload: error,
  };
};

export const getAllOpenOrdersRequest = () => {
  return {
    type: GET_ALL_OPEN_ORDERS_REQUEST,
  };
};

export const getAllOpenOrdersSuccess = (ordersData) => {
  return {
    type: GET_ALL_OPEN_ORDERS_SUCCESS,
    payload: ordersData,
  };
};

export const getAllOpenOrdersFailure = (error) => {
  return {
    type: GET_ALL_OPEN_ORDERS_FAILURE,
    payload: error,
  };
};
