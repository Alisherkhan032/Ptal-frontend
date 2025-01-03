import { all } from 'axios';
import {
    GET_ORDER_DETAILS_BY_REFERENCE_CODE_FAILURE,
    GET_ORDER_DETAILS_BY_REFERENCE_CODE_REQUEST,
    GET_ORDER_DETAILS_BY_REFERENCE_CODE_SUCCESS,
    GET_ALL_ORDER_DETAILS_REQUEST,
    GET_ALL_ORDER_DETAILS_SUCCESS,
    GET_ALL_ORDER_DETAILS_FAILURE,
   } from '../constants/orderDetailsConstants';


const initialState = {
    loading: false,
    allOrderDetails: [],
    orderDetails: [],
    error: null,
  };
  
  export const orderDetailReducer = (state = initialState, action) => {
    switch (action.type) {

      case GET_ALL_ORDER_DETAILS_REQUEST:
        return { ...state, loading: true, error: null, message: action.payload };

      case GET_ALL_ORDER_DETAILS_SUCCESS:
        return {
          ...state,
          loading: false,
          message: action.payload,
          allOrderDetails: action.payload,
          error: null,
        };
      
      case GET_ALL_ORDER_DETAILS_FAILURE:
        return { ...state, loading: false, error: action.payload, message: null };

        
      case GET_ORDER_DETAILS_BY_REFERENCE_CODE_REQUEST:
        return { ...state, loading: true, error: null, message: action.payload };
  
      case GET_ORDER_DETAILS_BY_REFERENCE_CODE_SUCCESS:
        return {
          ...state,
          loading: false,
          message: action.payload,
          orderDetails: action.payload,
          error: null,
        };
  
      case GET_ORDER_DETAILS_BY_REFERENCE_CODE_FAILURE:
        return { ...state, loading: false, error: action.payload, message: null };
  
      default:
        return state;
    }
  };