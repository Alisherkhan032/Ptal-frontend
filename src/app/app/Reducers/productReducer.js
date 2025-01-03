import {
  GET_ALL_PRODUCT_REQUEST,
  GET_ALL_PRODUCT_SUCCESS,
  GET_ALL_PRODUCT_FAILURE,
  GET_ALL_PRODUCT_BYCATEID_REQUEST,
  GET_ALL_PRODUCT_BYCATEID_SUCCESS,
  GET_ALL_PRODUCT_BYCATEID_FAILURE,
  GET_PRODUCT_BYID_REQUEST,
  GET_PRODUCT_BYID_FAILURE,
  GET_PRODUCT_BYID_SUCCESS,
} from '../constants/productConstants';

const initialState = {
  loading: false,
  allProducts: [],
  allProductsByCatId: [],
  productDetail: {},
  error: null,
};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_PRODUCT_REQUEST:
      return { ...state, loading: true, error: null, message: action.payload };

    case GET_ALL_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
        allProducts: action.payload,
        error: null,
      };

    case GET_ALL_PRODUCT_FAILURE:
      return { ...state, loading: false, error: action.payload, message: null };

    case GET_ALL_PRODUCT_BYCATEID_REQUEST:
      return { ...state, loading: true, error: null, message: action.payload };

    case GET_ALL_PRODUCT_BYCATEID_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
        allProductsByCatId: action.payload,
        error: null,
      };

    case GET_ALL_PRODUCT_BYCATEID_FAILURE:
      return { ...state, loading: false, error: action.payload, message: null };

    case GET_PRODUCT_BYID_REQUEST:
      return { ...state, loading: true, error: null, message: action.payload };

    case GET_PRODUCT_BYID_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
        productDetail: action.payload,
        error: null,
      };

    case GET_PRODUCT_BYID_FAILURE:
      return { ...state, loading: false, error: action.payload, message: null };

    default:
      return state;
  }
};
