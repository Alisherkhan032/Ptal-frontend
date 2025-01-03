import {
  GET_ALL_CATEGORY_REQUEST,
  GET_ALL_CATEGORY_SUCCESS,
  GET_ALL_CATEGORY_FAILURE,
  SET_SELECTED_CAT,
} from "../constants/categoryConstants";

const initialState = {
  loading: false,
  allCategories: [],
  selectedCatId: null,
  error: null,
};

export const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_CATEGORY_REQUEST:
      return { ...state, loading: true, error: null, message: action.payload };

    case GET_ALL_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
        allCategories: action.payload,
        error: null,
      };

    case GET_ALL_CATEGORY_FAILURE:
      return { ...state, loading: false, error: action.payload, message: null };

    case SET_SELECTED_CAT:
      return { ...state, loading: false, selectedCatId: action.payload };

    default:
      return state;
  }
};
