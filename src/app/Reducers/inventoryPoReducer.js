import {
  GET_ALL_INVENTORY_PO_REQUEST,
  GET_ALL_INVENTORY_PO_SUCCESS,
  GET_ALL_INVENTORY_PO_FAILURE,
  UPDATE_INVENTORY_PO_REQUEST,
  UPDATE_INVENTORY_PO_SUCCESS,
  UPDATE_INVENTORY_PO_FAILURE,
  GET_INVENTORY_POBYID_REQUEST,
  GET_INVENTORY_POBYID_SUCCESS,
  GET_INVENTORY_POBYID_FAILURE,
} from "../constants/inventoryPoConstants";

const initialState = {
  loading: false,
  allInventoryPO: [],
  poDetailbyId: {},
  error: null,
};

export const inventoryPoReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_INVENTORY_PO_REQUEST:
      return { ...state, loading: true, error: null, message: action.payload };

    case GET_ALL_INVENTORY_PO_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
        allInventoryPO: action.payload,
        error: null,
      };

    case GET_ALL_INVENTORY_PO_FAILURE:
      return { ...state, loading: false, error: action.payload, message: null };

    case GET_INVENTORY_POBYID_REQUEST:
      return { ...state, loading: true, error: null, message: action.payload };

    case GET_INVENTORY_POBYID_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
        poDetailbyId: action.payload,
        error: null,
      };

    case GET_INVENTORY_POBYID_FAILURE:
      return { ...state, loading: false, error: action.payload, message: null };

    default:
      return state;
  }
};
