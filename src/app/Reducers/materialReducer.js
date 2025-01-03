import {
  GET_ALL_MATERIAL_REQUEST,
  GET_ALL_MATERIAL_SUCCESS,
  GET_ALL_MATERIAL_FAILURE,
  GET_ALL_MATERIAL_BYCATEID_REQUEST,
  GET_ALL_MATERIAL_BYCATEID_SUCCESS,
  GET_ALL_MATERIAL_BYCATEID_FAILURE,
} from "../constants/materialConstants";

const initialState = {
  loading: false,
  allMaterials: [],
  allMaterialsByCatId: [],
  error: null,
};

export const materialReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_MATERIAL_REQUEST:
      return { ...state, loading: true, error: null, message: action.payload };

    case GET_ALL_MATERIAL_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
        allMaterials: action.payload,
        error: null,
      };

    case GET_ALL_MATERIAL_FAILURE:
      return { ...state, loading: false, error: action.payload, message: null };

    case GET_ALL_MATERIAL_BYCATEID_REQUEST:
      return { ...state, loading: true, error: null, message: action.payload };

    case GET_ALL_MATERIAL_BYCATEID_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
        allMaterialsByCatId: action.payload,
        error: null,
      };

    case GET_ALL_MATERIAL_BYCATEID_FAILURE:
      return { ...state, loading: false, error: action.payload, message: null };

    default:
      return state;
  }
};
