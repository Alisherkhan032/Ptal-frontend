import{
    GET_ALL_BULK_RAW_MATERIAL_PO_FAILURE,
    GET_ALL_BULK_RAW_MATERIAL_PO_REQUEST,
    GET_ALL_BULK_RAW_MATERIAL_PO_SUCCESS,
    UPDATE_BULK_RAW_MATERIAL_PO_FAILURE,
    UPDATE_BULK_RAW_MATERIAL_PO_REQUEST,
    UPDATE_BULK_RAW_MATERIAL_PO_SUCCESS,    
} from '../constants/bulkRawMaterialPOConstants';


export const getAllBulkRawMaterialPORequest = () => {
    return {
      type: GET_ALL_BULK_RAW_MATERIAL_PO_REQUEST,
    };
  };
  
  export const getAllBulkRawMaterialPOSuccess = (poData) => {
    return {
      type: GET_ALL_BULK_RAW_MATERIAL_PO_SUCCESS,
      payload: poData,
    };
  };
  
  export const getAllBulkRawMaterialPOFailure = (error) => {
    return {
      type: GET_ALL_BULK_RAW_MATERIAL_PO_FAILURE,
      payload: error,
    };
  };
  
  export const updateBulkRawMaterialPORequest = () => {
    return {
      type: UPDATE_BULK_RAW_MATERIAL_PO_REQUEST,
    };
  };
  
  export const updateBulkRawMaterialPOSuccess = (updatedPO) => {
    return {
      type: UPDATE_BULK_RAW_MATERIAL_PO_SUCCESS,
      payload: updatedPO,
    };
  };
  
  export const updateBulkRawMaterialPOFailure = (error) => {
    return {
      type: UPDATE_BULK_RAW_MATERIAL_PO_FAILURE,
      payload: error,
    };
  };