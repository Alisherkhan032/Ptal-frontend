import {
  GET_ALL_CATEGORY_REQUEST,
  GET_ALL_CATEGORY_SUCCESS,
  GET_ALL_CATEGORY_FAILURE,
  SET_SELECTED_CAT,
} from "../constants/categoryConstants";

export const getAllCategoryRequest = () => {
  return {
    type: GET_ALL_CATEGORY_REQUEST,
  };
};

export const getAllCategorySuccess = (categoryData) => {
  return {
    type: GET_ALL_CATEGORY_SUCCESS,
    payload: categoryData,
  };
};

export const getAllCategoryFailure = (error) => {
  return {
    type: GET_ALL_CATEGORY_FAILURE,
    payload: error,
  };
};

export const setSelectedCat = (catId) => {
  return {
    type: SET_SELECTED_CAT,
    payload: catId,
  };
};
