import {
    GET_ALL_OUTWARDED_PRODUCTS_FAILURE,
    GET_ALL_OUTWARDED_PRODUCTS_REQUEST,
    GET_ALL_OUTWARDED_PRODUCTS_SUCCESS,
} from '../constants/outwardedProductsConstants';

export const getAllOutwardedProductsRequest = () => {
    return {
        type: GET_ALL_OUTWARDED_PRODUCTS_REQUEST,
    };
};

export const getAllOutwardedProductsSuccess = (outwardedProductsData) => {
    return {
        type: GET_ALL_OUTWARDED_PRODUCTS_SUCCESS,
        payload: outwardedProductsData,
    };
} 

export const getAllOutwardedProductsFailure = (error) => {
    return {
        type: GET_ALL_OUTWARDED_PRODUCTS_FAILURE,
        payload: error,
    };
}