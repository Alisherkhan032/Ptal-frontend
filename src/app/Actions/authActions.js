import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  SET_TOKEN,
  SET_USERTYPE,
} from "../constants/authConstants";

export const userLoginRequest = () => {
  return {
    type: USER_LOGIN_REQUEST,
  };
};

export const userLoginSuccess = (userData) => {
  return {
    type: USER_LOGIN_SUCCESS,
    payload: userData,
  };
};

export const userLoginFail = (error) => {
  return {
    type: USER_LOGIN_FAIL,
    payload: error,
  };
};

export const userLogout = (logout) => {
  return {
    type: USER_LOGOUT,
    payload: logout,
  };
};

export const setToken = (token) => {
  return {
    type: SET_TOKEN,
    payload: token,
  };
};

export const setUserType = (userType) => {
  return {
    type: SET_USERTYPE,
    payload: userType,
  };
};
