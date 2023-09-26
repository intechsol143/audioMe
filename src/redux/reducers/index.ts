import {combineReducers} from 'redux';
import userReducer from './userReducer';
import appReducer from './appReducer';
export default combineReducers({
  USER: userReducer,
  APPSTATE: appReducer,
});
