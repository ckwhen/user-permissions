import { combineReducers } from 'redux';
import { reducer as permissionReducer } from 'user-permissions';
import comment from './commentReducer';

export default combineReducers({
  comment,
  permission: permissionReducer,
});