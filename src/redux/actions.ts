//=======================================================Action Types Constants
const USER_AUTHORIZE = 'USER_SIGN_IN',
  USERLOGGED = 'USERLOGGED',
  UPDATE = 'UPDATE',
  LOGOUT = 'LOGOUT',
  FCM = 'FCM',
  DESTINATION = 'DESTINATION',
  CURRENT_LOCATION = 'CURRENT_LOCATION',
  SELECTED_TOUR = 'SELECTED_TOUR',
  SETDUMMY = 'SETDUMMY',
  SET_TOKEN = 'SET_TOKEN',
  SET_CITIES = 'SET_CITIES',
  SET_USER_CITY = 'SET_USER_CITY',
  ONLINE = 'ONLINE';
//========================================================Dispatchers

const logged = payload => dispatch => {
  dispatch({type: USERLOGGED, payload});
};
const update = payload => dispatch => {
  dispatch({type: UPDATE, payload});
};
const destination = payload => dispatch => {
  dispatch({type: DESTINATION, payload});
};
const setdummyData = payload => dispatch => {
  dispatch({type: SETDUMMY, payload});
};
const online = () => dispatch => {
  dispatch({type: ONLINE});
};
const logoutUser = () => dispatch => {
  dispatch({type: LOGOUT});
};
const fcm = payload => dispatch => dispatch({type: FCM, payload});

const setCurrentLocation = payload => dispatch => {
  dispatch({type: CURRENT_LOCATION, payload});
};

const setSelectedTours = payload => dispatch => {
  dispatch({type: SELECTED_TOUR, payload});
};

const setToken = payload => dispatch => {
  dispatch({type: SET_TOKEN, payload});
};

const setCities = payload => dispatch => {
  dispatch({type: SET_CITIES, payload});
};
const setUserCity = payload => dispatch => {
  dispatch({type: SET_USER_CITY, payload});
};

//========================================================Exporter
const ActionType = {
  USERLOGGED,
  UPDATE,
  LOGOUT,
  SET_TOKEN,
  SETDUMMY,
  FCM,
  DESTINATION,
  ONLINE,
  CURRENT_LOCATION,
  SELECTED_TOUR,
  SET_CITIES,
  SET_USER_CITY,
};
export {
  ActionType,
  logged,
  update,
  logoutUser,
  fcm,
  destination,
  setCurrentLocation,
  setSelectedTours,
  online,
  setdummyData,
  setToken,
  setCities,
  setUserCity,
};
