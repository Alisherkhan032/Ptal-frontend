import {
    GET_ALL_ENGRAVING_ORDERS_FAILURE,
    GET_ALL_ENGRAVING_ORDERS_REQUEST,
    GET_ALL_ENGRAVING_ORDERS_SUCCESS,
} from '../constants/engravingOrderConstants';

const initialState = {
    loading: false,
    allEngravingOrders: [],
    error: null,
};

export const engravingOrderReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_ENGRAVING_ORDERS_REQUEST:
            return { ...state, loading: true, error: null, message: action.payload };

        case GET_ALL_ENGRAVING_ORDERS_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload,
                allEngravingOrders: action.payload,
                error: null,
            };

        case GET_ALL_ENGRAVING_ORDERS_FAILURE:
            return { ...state, loading: false, error: action.payload, message: null };

        default:
            return state;
    }
}