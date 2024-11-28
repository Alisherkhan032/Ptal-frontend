import {
  GET_ALL_BATCH_REQUEST,
  GET_ALL_BATCH_SUCCESS,
  GET_ALL_BATCH_FAILURE,
  SET_RAWMATERIAL_ID_BATCH
} from "../constants/batchConstants";

export const getAllBatchRequest = () => {
  return {
    type: GET_ALL_BATCH_REQUEST,
  };
};

export const getAllBatchSuccess = (batchData) => {
  return {
    type: GET_ALL_BATCH_SUCCESS,
    payload: batchData,
  };
};

export const getAllBatchFailure = (error) => {
  return {
    type: GET_ALL_BATCH_FAILURE,
    payload: error,
  };
};


export const setRawMaterialIdBatch = (rawMaterialId)=>{
  return {
    type : SET_RAWMATERIAL_ID_BATCH,
    payload : rawMaterialId
  }
}
