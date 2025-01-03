import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  SET_TOKEN,
} from "../constants/authConstants";

const initialState = {
  loading: false,
  userInfo: null,
  token: null,
  error: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { ...state, loading: true, error: null, message: action.payload };

    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload.message,
        userInfo: action.payload.userData,
        token: action.payload.token,
        error: null,
      };

    case USER_LOGIN_FAIL:
      return { ...state, loading: false, error: action.payload, message: null };

    case USER_LOGOUT:
      return {
        ...state,
        userInfo: null,
        message: null,
        error: null,
      };

    case SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };

    default:
      return state;
  }
};
