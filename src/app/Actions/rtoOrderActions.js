import {
    GET_ALL_RTO_ORDER_FAILURE,
    GET_ALL_RTO_ORDER_REQUEST,
    GET_ALL_RTO_ORDER_SUCCESS,
} from '../constants/rtoOrderConstants';

export const getAllRtoOrderRequest = () => {
    return {
        type: GET_ALL_RTO_ORDER_REQUEST,
    };
}

export const getAllRtoOrderSuccess = (ordersData) => {
    return {
        type: GET_ALL_RTO_ORDER_SUCCESS,
        payload: ordersData,
    };
}

export const getAllRtoOrderFailure = (error) => {
    return {
        type: GET_ALL_RTO_ORDER_FAILURE,
        payload: error,
    };
}