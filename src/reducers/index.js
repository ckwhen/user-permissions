import {
  uniq,
  keyBy,
  cloneDeep,
} from 'lodash';
import axios from 'axios';
import {
  prefix,
  INITIALIZE,
  DESTORY,
  FETCH_USER_PERMISSIONS,
  START_USER_PERMISSIONS_TIMER,
} from '../actions/index';
import { toArray } from '../utils';

// const apiPath = 'Authorization/GetAuthorized';
const apiPath = 'http://localhost:8081/api/permissions';

// 跟著promiseMiddleware的promiseTypeSuffixes
// 若suffix有變動這邊要一併修改
const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAIL = 'FAIL';

const isUserPermissionAction = action =>
  action
  && action.type
  && action.type.indexOf(prefix) > -1;

// 各permission的action
const behaviors = {
  [INITIALIZE]: (state, action) => {
    const {
      functionCode: initialFunctionCode,
      actionCode: initialActionCode,
      functionCodes: initialFunctionCodes,
      propNamespace: initialPropNamespace,
    } = action.meta;
    // 設定propNamespace
    const propNamespace = initialPropNamespace || state.propNamespace;

    // 將function和action code轉成物件字串提供使用
    let functionCodes = toArray(initialFunctionCode);
    let actionCodes = toArray(initialActionCode);
    if (initialFunctionCodes) {
      initialFunctionCodes.forEach((item) => {
        const actionCodeArray = toArray(item.actionCode);
        functionCodes.push(item.functionCode);
        actionCodes = actionCodes.concat(actionCodeArray);
      });
    }
    functionCodes = uniq(functionCodes);
    actionCodes = uniq(actionCodes);

    return Object.assign({}, state, {
      propNamespace,
      isInitialized: true,
      functionCodes: keyBy(functionCodes),
      actionCodes: keyBy(actionCodes),
    });
  },
  [`${FETCH_USER_PERMISSIONS}_${REQUEST}`]: state => Object.assign({}, state, { permissions: null }),
  [`${FETCH_USER_PERMISSIONS}_${SUCCESS}`]: (state, action) => Object.assign({}, state, {
    // action.response.data api結構
    // response.action.payload.data.data axios結構
    permissions: (action.response && action.response.data)
      || (action.payload && action.payload.data && action.payload.data.data),
  }),
  [`${FETCH_USER_PERMISSIONS}_${FAIL}`]: state => Object.assign({}, state, { permissions: null }),
};

// 各permission的reducer
const initialState = {
  isInitialized: false,
  propNamespace: 'permission',
  permissions: null,
};
const reducer = (state = initialState, action) => {
  const behavior = behaviors[action.type];
  return behavior ? behavior(state, action) : state;
};

export default function createReducer(state = {}, action) {
  const permission = action && action.meta && action.meta.permission;
  if (!permission || !isUserPermissionAction(action)) {
    return state;
  }
  // 建立各permission的reducer
  const reducers = cloneDeep(state);
  reducers[permission] = reducer(state[permission], action);
  if (action.type === DESTORY) {
    delete reducers[permission];
  }
  return reducers;
}

export function initialize(config) {
  return {
    type: INITIALIZE,
    meta: config,
  };
}

export function destory(permission) {
  return {
    type: DESTORY,
    meta: { permission },
  };
}

export function fetchUserPermissions(permission, params) {
  return {
    type: START_USER_PERMISSIONS_TIMER,
    payload: {
      type: FETCH_USER_PERMISSIONS,
      meta: { permission },
      payload: axios.get(apiPath, {
        params,
      }),
    },
  };
}
