import { persistReducer } from 'redux-persist';

import { composePersistConfig } from '../storage.js';
import { exampleReducerTypes } from '../actions';

const persistConfig = composePersistConfig({
  key: 'exampleReducer',
  version: 1,
});

const initialState = {
  value: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case exampleReducerTypes.EXAMPLE_REDUCER_SET: {
      const { value } = action;

      return { ...state, value };
    }

    default: {
      return state;
    }
  }
};

export default persistReducer(persistConfig, reducer);
