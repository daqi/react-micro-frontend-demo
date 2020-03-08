import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App, { routes } from "./App";
// import * as serviceWorker from './serviceWorker';

if (window.__micro) {
  window.subappRoutes["my-app-2"] = routes;
} else {
  ReactDOM.render(<App />, document.getElementById("root"));
}
