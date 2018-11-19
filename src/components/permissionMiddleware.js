/* eslint consistent-return: 0 */
import {
  START_USER_PERMISSIONS_TIMER,
  STOP_USER_PERMISSIONS_TIMER,
} from '../actions/index';
import {
  validateTimerInterval,
  DEFAULT_TIME_INTERVAL,
} from '../utils';

// The default async action types
const defaultTypes = [START_USER_PERMISSIONS_TIMER, STOP_USER_PERMISSIONS_TIMER];

const permissionMiddleware = ({ dispatch }) => {
  let timer = null;
  return next => (action) => {
    if (defaultTypes.indexOf(action.type) < 0) {
      return next(action);
    }

    if (action.type === START_USER_PERMISSIONS_TIMER) {
      const {
        payload,
        immediately = true,
      } = action;
      const timerInterval = action.timerInterval || DEFAULT_TIME_INTERVAL;
      validateTimerInterval(timerInterval);

      if (timer) {
        clearInterval(timer);
      }

      const func = () => dispatch(payload);

      if (immediately) {
        func();
      }

      timer = setInterval(func, timerInterval);
    }

    if (action.type === STOP_USER_PERMISSIONS_TIMER) {
      clearInterval(timer);
    }
  };
};

export default permissionMiddleware;
