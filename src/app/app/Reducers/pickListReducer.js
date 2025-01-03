import {
  GET_ALL_PICKLIST_REQUEST,
  GET_ALL_PICKLIST_SUCCESS,
  GET_ALL_PICKLIST_FAILURE,
  GET_PICKLIST_BYID_REQUEST,
  GET_PICKLIST_BYID_FAILURE,
  GET_PICKLIST_BYID_SUCCESS,
} from "../constants/pickListContants";

const initialState = {
  loading: false,
  allpickListData: [],
  pickListDetail: {},
  error: null,
};

export const pickListReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_PICKLIST_REQUEST:
      return { ...state, loading: true, error: null, message: action.payload };

    case GET_ALL_PICKLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
        allpickListData: action.payload,
        error: null,
      };

    case GET_ALL_PICKLIST_FAILURE:
      return { ...state, loading: false, error: action.payload, message: null };

    case GET_PICKLIST_BYID_REQUEST:
      return { ...state, loading: true, error: null, message: action.payload };

    case GET_PICKLIST_BYID_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
        pickListDetail: action.payload,
        error: null,
      };

    case GET_PICKLIST_BYID_FAILURE:
      return { ...state, loading: false, error: action.payload, message: null };

    default:
      return state;
  }
};
