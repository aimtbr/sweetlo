import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import App from './root';
import { store, persistor } from './store';

import 'normalize.css';
import '/assets/styles';

const app = (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
const container = document.getElementById('root');

render(app, container);
