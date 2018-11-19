import { createStore, applyMiddleware } from 'redux';
import { permissionMiddleware } from 'user-permissions';
import createPromise from 'redux-promise-middleware';
import logger from 'redux-logger';
import rootReducer from './reducers';

const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAIL = 'FAIL';

const promiseMiddleware = createPromise({
  promiseTypeSuffixes: [REQUEST, SUCCESS, FAIL],
});

const store = createStore(rootReducer, {}, applyMiddleware(
  permissionMiddleware,
  promiseMiddleware,
  logger,
));

export default store;
