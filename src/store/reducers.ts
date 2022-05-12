import { combineReducers } from 'redux';
import userReducer from './users/reducer';
import spaceReducer from './spaces/reducer';

export default combineReducers({ userReducer, spaceReducer });
