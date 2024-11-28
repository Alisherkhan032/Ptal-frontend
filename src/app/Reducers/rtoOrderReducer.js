import {
    GET_ALL_RTO_ORDER_FAILURE,
    GET_ALL_RTO_ORDER_REQUEST,
    GET_ALL_RTO_ORDER_SUCCESS,
} from '../constants/rtoOrderConstants';

const initialState = {
    loading: false,
    orders: [],
    error: '',
};

export const rtoOrderReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_RTO_ORDER_REQUEST:
            return { ...state, loading: true, error: '' };

        case GET_ALL_RTO_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: action.payload,
                error: '',
            };

        case GET_ALL_RTO_ORDER_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
}
