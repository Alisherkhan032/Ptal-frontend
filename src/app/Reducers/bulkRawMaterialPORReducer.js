import{
  GET_ALL_BULK_RAW_MATERIAL_PO_FAILURE,
  GET_ALL_BULK_RAW_MATERIAL_PO_REQUEST,
  GET_ALL_BULK_RAW_MATERIAL_PO_SUCCESS,
  UPDATE_BULK_RAW_MATERIAL_PO_FAILURE,
  UPDATE_BULK_RAW_MATERIAL_PO_REQUEST,
  UPDATE_BULK_RAW_MATERIAL_PO_SUCCESS,    
} from '../constants/bulkRawMaterialPOConstants';


const initialState = {
    loading: false,
    allBulkRawMaterialPO: [],
    error: null,
  };
  
  export const bulkRawMaterialPORReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_ALL_BULK_RAW_MATERIAL_PO_REQUEST:
        return { ...state, loading: true, error: null, message: action.payload };
  
      case GET_ALL_BULK_RAW_MATERIAL_PO_SUCCESS:
        return {
          ...state,
          loading: false,
          message: action.payload,
          allBulkRawMaterialPO: action.payload,
          error: null,
        };
  
      case GET_ALL_BULK_RAW_MATERIAL_PO_FAILURE:
        return { ...state, loading: false, error: action.payload, message: null };
  
      default:
        return state;
    }
  };
  