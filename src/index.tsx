import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import configureStore from "./baseplate/configureStore";
import history from "./baseplate/history";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
// import { Menu } from './Menu';

const initialState = {}; // Empty | LocalStorage | SessionStorage
const store = configureStore(initialState, history);
const tracesSampleRate = process.env.NODE_ENV === "production" ? 0.5 : 1;
const MOUNT_NODE = document.getElementById("root");

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: tracesSampleRate,
});

ReactDOM.render(
  <Provider store={store}>
    {/* <Menu /> */}
    <App />
  </Provider>,
  MOUNT_NODE
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
