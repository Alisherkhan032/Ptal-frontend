import { all } from 'axios';
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
} from '../constants/orderConstants';

const initialState = {
  loading: false,
  allAmazonOrders: [],
  allCustomOrders: [],
  orderDetail: null,
  allOpenOrders: [],
  error: null,
};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_AMAZON_ORDERS_REQUEST:
      return { ...state, loading: true, error: null, message: action.payload };

    case GET_ALL_AMAZON_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
        allAmazonOrders: action.payload,
        error: null,
      };

    case GET_ALL_AMAZON_ORDERS_FAILURE:
      return { ...state, loading: false, error: action.payload, message: null };

    case GET_ALL_CUSTOM_ORDERS_REQUEST:
      return { ...state, loading: true, error: null, message: action.payload };

    case GET_ALL_CUSTOM_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
        allCustomOrders: action.payload,
        error: null,
      };
    
    case GET_ALL_CUSTOM_ORDERS_FAILURE:
      return { ...state, loading: false, error: action.payload, message: null };

    case GET_ALL_OPEN_ORDERS_REQUEST:
      return { ...state, loading: true, error: null, message: action.payload };

    case GET_ALL_OPEN_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
        allOpenOrders: action.payload,
        error: null,
      };

    case GET_ALL_OPEN_ORDERS_FAILURE:
      return { ...state, loading: false, error: action.payload, message: null };

    case GET_ORDERBY_ORDERID_REQUEST:
      return { ...state, loading: true, error: null, message: action.payload };

    case GET_ORDERBY_ORDERID_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
        orderDetail: action.payload,
        error: null,
      };

    case GET_ORDERBY_ORDERID_FAILURE:
      return { ...state, loading: false, error: action.payload, message: null };

    default:
      return state;
  }
};
