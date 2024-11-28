import { all } from 'axios';
import {
    GET_ALL_OUTWARDED_PRODUCTS_FAILURE,
    GET_ALL_OUTWARDED_PRODUCTS_REQUEST,
    GET_ALL_OUTWARDED_PRODUCTS_SUCCESS,
} from '../constants/outwardedProductsConstants';

const initialState = {
    loading : false,
    allOutwardedProducts : [],
    error : null,
};

export const outwardedProductsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_OUTWARDED_PRODUCTS_REQUEST:
            return { ...state, loading: true, error: null, message: action.payload };

        case GET_ALL_OUTWARDED_PRODUCTS_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload,
                allOutwardedProducts: action.payload,
                error: null,
            };
        
        case GET_ALL_OUTWARDED_PRODUCTS_FAILURE:
            return { ...state, loading: false, error: action.payload, message: null };

        default:
            return state;
    }
};