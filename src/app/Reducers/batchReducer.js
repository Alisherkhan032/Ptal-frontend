import {
  GET_ALL_BATCH_FAILURE,
  GET_ALL_BATCH_REQUEST,
  GET_ALL_BATCH_SUCCESS,
  SET_RAWMATERIAL_ID_BATCH,
} from "../constants/batchConstants";

const initialState = {
  loading: false,
  allBatches: [],
  selectedRawMaterialId: null,
  error: null,
};

export const batchReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_BATCH_REQUEST:
      return { ...state, loading: true, error: null, message: action.payload };

    case GET_ALL_BATCH_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
        allBatches: action.payload,
        error: null,
      };

    case GET_ALL_BATCH_FAILURE:
      return { ...state, loading: false, error: action.payload, message: null };

    case SET_RAWMATERIAL_ID_BATCH:
      return { ...state, selectedRawMaterialId: action.payload };
    default:
      return state;
  }
};
