import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import App from './components/App';

ReactDOM.render((
  <Provider store={store}>
    <BrowserRouter basename="/complex-hoc">
      <App />
    </BrowserRouter>
  </Provider>
), document.getElementById('root'));
