import { combineReducers } from 'redux';

import { appTypes } from '../actions';
import exampleReducer from './exampleReducer.js';

const reducers = combineReducers({ exampleReducer });

const reducer = (state, action) => {
  switch (action.type) {
    case appTypes.APP_RESET: {
      state = undefined;

      break;
    }

    default: {
      return reducers(state, action);
    }
  }
};

export default reducer;
