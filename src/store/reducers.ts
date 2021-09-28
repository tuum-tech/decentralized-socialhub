import { combineReducers } from 'redux';
import userReducer from './users/reducer';
import templateReducer from './templates/reducer';

export default combineReducers({ userReducer, templateReducer });
