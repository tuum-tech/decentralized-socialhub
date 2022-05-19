import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'connected-react-router';
import App from './App';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import configureStore from './baseplate/configureStore';
import { PersistGate } from 'redux-persist/lib/integration/react';

import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import packageJson from '../package.json';
// import { Menu } from './Menu';

const { store, persistor, history } = configureStore();

const projectName =
  process.env.NODE_ENV === 'production'
    ? packageJson.name
    : packageJson.name + '-test';
const MOUNT_NODE = document.getElementById('root');

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  release: projectName + '@' + packageJson.version,
  integrations: [new Integrations.BrowserTracing()],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0
});

ReactDOM.render(
  <Provider store={store}>
    {/* <Menu /> */}
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </PersistGate>
  </Provider>,
  MOUNT_NODE
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
