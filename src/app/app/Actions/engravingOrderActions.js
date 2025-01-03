import {
    GET_ALL_ENGRAVING_ORDERS_FAILURE,
    GET_ALL_ENGRAVING_ORDERS_REQUEST,
    GET_ALL_ENGRAVING_ORDERS_SUCCESS,
} from '../constants/engravingOrderConstants';

export const getAllEngravingOrdersRequest = () => {
    return {
        type: GET_ALL_ENGRAVING_ORDERS_REQUEST,
    };
}

export const getAllEngravingOrdersSuccess = (ordersData) => {
    return {
        type: GET_ALL_ENGRAVING_ORDERS_SUCCESS,
        payload: ordersData,
    };
}

export const getAllEngravingOrdersFailure = (error) => {
    return {
        type: GET_ALL_ENGRAVING_ORDERS_FAILURE,
        payload: error,
    };
}