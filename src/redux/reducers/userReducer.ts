import {ActionType} from '../actions';
const InitialCalState = {
  userData: {},
  isLoggedIn: false,
  fcmtoken: '',
  token: '',
  latitude: '33.5651',
  longitude: '73.0169',
  onlineState: true,
  dummyData: {},
};

export default (state = InitialCalState, {type, payload}) => {
  switch (type) {
    case ActionType.USERLOGGED: {
      return {
        ...state,
        isLoggedIn: true,
        userData: {...payload},
      };
    }
    case ActionType.UPDATE: {
      return {
        ...state,
        userData: {...payload},
      };
    }
    case ActionType.FCM: {
      return {
        ...state,
        fcmtoken: payload,
      };
    }
    case ActionType.ONLINE: {
      return {
        ...state,
        onlineState: !state.onlineState,
      };
    }
    case ActionType.SET_TOKEN: {
      return {
        ...state,
        token: payload,
      };
    }
    case ActionType.SETDUMMY: {
      return {
        ...state,
        dummyData: payload,
      };
    }
    case ActionType.LOGOUT: {
      return InitialCalState;
    }

    default:
      return state;
  }
};
