import {
  GET_ALL_ASSEMBLY_PO_REQUEST,
  GET_ALL_ASSEMBLY_PO_SUCCESS,
  GET_ALL_ASSEMBLY_PO_FAILURE,
  UPDATE_ASSEMBLY_PO_REQUEST,
  UPDATE_ASSEMBLY_PO_SUCCESS,
  UPDATE_ASSEMBLY_PO_FAILURE,
  GET_ALL_ASSEMBLY_PO_BY_ID_REQUEST,
  GET_ALL_ASSEMBLY_PO_BY_ID_SUCCESS,
  GET_ALL_ASSEMBLY_PO_BY_ID_FAILURE,
} from "../constants/assemblyPoConstants";

const initialState = {
  loading: false,
  allAssemblyPO: [],
  assemblyPOByID: {},
  error: null,
};

export const assemblyPoReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_ASSEMBLY_PO_REQUEST:
      return { ...state, loading: true, error: null, message: action.payload };

    case GET_ALL_ASSEMBLY_PO_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
        allAssemblyPO: action.payload,
        error: null,
      };

    case GET_ALL_ASSEMBLY_PO_FAILURE:
      return { ...state, loading: false, error: action.payload, message: null };

    case GET_ALL_ASSEMBLY_PO_BY_ID_REQUEST:
      return { ...state, loading: true, error: null, message: action.payload };
    
    case GET_ALL_ASSEMBLY_PO_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
        assemblyPOByID: action.payload,
        error: null,
      };

    case GET_ALL_ASSEMBLY_PO_BY_ID_FAILURE:
      return { ...state, loading: false, error: action.payload, message: null };

    default:
      return state;
  }
};
