import {
  GET_CATEGORY_VALUE,
  GET_MATERIAL_VALUE,
  GET_MATERIAL_NAME,
  GET_VENDOR_VALUE,
  GET_PRODUCT_VALUE,
  GET_BATCH_NUMBER,
  GET_PRODUCT_NAME
} from "../constants/dropDownValuesConstants";

const initialState = {
  dropDownCatValue: "",
  dropDownMatValue: "",
  dropDownMatName: "",
  dropDownVendorValue: "",
  dropDownProductValue: "",
  dropDownBatchNumber: "",
  dropdownProductName: "",
};

export const dropValueReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORY_VALUE:
      return {
        ...state,
        dropDownCatValue: action.payload,
      };

    case GET_MATERIAL_VALUE:
      return {
        ...state,
        dropDownMatValue: action.payload,
      };


      case GET_MATERIAL_NAME:
      return {
        ...state,
        dropDownMatName: action.payload,
        };
  
    case GET_VENDOR_VALUE:
      return {
        ...state,
        dropDownVendorValue: action.payload,
      };

    case GET_PRODUCT_VALUE:
      return {
        ...state,
        dropDownProductValue: action.payload,
      };

      case GET_PRODUCT_NAME:
        return {
          ...state,
          dropdownProductName: action.payload,
        };

    case GET_BATCH_NUMBER:
      return {
        ...state,
        dropDownBatchNumber: action.payload,
      };

    default:
      return state;
  }
};
