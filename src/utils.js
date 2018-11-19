import { isArray, find } from 'lodash';
import symbols from './symbols/index';

const { IS_CALL_API, IS_AXIOS } = symbols;

// min * sec * millisecond
export const DEFAULT_TIME_INTERVAL = 30 * 60 * 1000;

export const toArray = (code) => {
  let currentCode = code;
  if (!isArray(currentCode)) {
    currentCode = currentCode ? [currentCode] : [];
  }
  return currentCode;
};

export const isContainArray = array => isArray(array) && array.length > 0;

export const isCodeEqual = (currentCode, code) => currentCode === code;

export const getModuleCode = (permission, moduleCodes) => find(
  moduleCodes,
  code => isCodeEqual(code, permission.moduleCode),
);

export const getActionCode = (permission, actionCodes) => find(
  actionCodes,
  code => isCodeEqual(code, permission.actionCode),
);

export const getFnCode = (permission, functionCodes) => find(
  functionCodes,
  code => isCodeEqual(code, permission.functionCode),
);

export const getParentFnCode = (permission, parentFunctionCodes) => find(
  parentFunctionCodes,
  code => isCodeEqual(code, permission.parentFunctionCode),
);

export const error = (message) => {
  throw new Error(message);
};

export const validateActionFrom = (from) => {
  if (!from) {
    error('Missing parameter. From is required');
  }
  if ([IS_CALL_API, IS_AXIOS].indexOf(from) < 0) {
    const isCallApi = IS_CALL_API.toString();
    const isAxios = IS_AXIOS.toString();
    error(`From must be ${isCallApi} or ${isAxios}`);
  }
};

export const validateTimerInterval = (timerInterval) => {
  if (typeof timerInterval !== 'number') {
    error('Interval must be a number');
  }
};

export const validateFunctionCode = (functionCode) => {
  if (!functionCode) {
    error('Missing parameter. FunctionCode is required');
  }
  if (typeof functionCode !== 'string' && !isArray(functionCode)) {
    error('FunctionCode must be a string or an array');
  }
};

export const validatePermission = (permission) => {
  if (!permission) {
    error('Missing parameter. Permission is required');
  }
  if (typeof permission !== 'string') {
    error('Permission must be a string');
  }
};

export const validatePropNamespace = (propNamespace) => {
  if (propNamespace && typeof propNamespace !== 'string') {
    error('If propNamespace exist. Must be string');
  }
};

export const validateActionCode = (actionCode) => {
  if (actionCode && typeof actionCode !== 'string' && !isArray(actionCode)) {
    error('If actionCode exist. Must be a string or an array');
  }
};

export const validatePermissionReducer = (permissionReducer) => {
  if (!permissionReducer) {
    error('If actionCode exist. Must be a string or an array');
  }
};
