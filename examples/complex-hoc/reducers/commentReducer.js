import axios from 'axios';
import typeToReducer from 'type-to-reducer';
import { actionTypes } from 'user-permissions';

const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAIL = 'FAIL';

const path = 'complex/hoc/comment';
const FETCH_COMMENTS = `${path}FETCH_COMMENTS`;

const initialState = {
  data: null,
};
export default typeToReducer({
  [FETCH_COMMENTS]: {
    [REQUEST]: state => Object.assign({}, state, { data: null }),
    [SUCCESS]: (state, action) => Object.assign({}, state, {
      data: action.payload.data,
    }),
    [FAIL]: state => Object.assign({}, state, { data: null }),
  },
}, initialState);

export function fetchComments(params) {
  return {
    type: FETCH_COMMENTS,
    payload: axios.get('https://jsonplaceholder.typicode.com/comments', {
      params,
    }),
  };
}
