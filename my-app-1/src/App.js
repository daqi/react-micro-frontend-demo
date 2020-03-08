import React from "react";
import { Route, IndexRoute, Link, Router, hashHistory } from "react-router";

const basePath = window.__micro ? "/subapp/my-app-1" : "/";

const App = props => {
  console.log('app 1')
  return (
    <div>
      <h1>App 1</h1>
      <ul>
        <li>
          <Link to={basePath}>Home</Link>
        </li>
        <li>
          <Link to={`${basePath}/about`}>About</Link>
        </li>
        <li>
          <Link to={`${basePath}/inbox`}>Inbox</Link>
        </li>
      </ul>
      {props.children}
    </div>
  );
};

const Home = () => {
  return <div>App 1 Home</div>;
};
const About = () => {
  return <div>App 1 About</div>;
};
const Inbox = () => {
  return <div>App 1 Inbox</div>;
};


export const routes = (
  <Route path={basePath} component={App}>
    <IndexRoute component={Home} />
    <Route path={`${basePath}/about`} component={About} />
    <Route path={`${basePath}/inbox`} component={Inbox} />
  </Route>
);

const TheRouter = () => {
  return (
    <Router history={hashHistory}>
      {routes}
    </Router>
  );
};

export default TheRouter;
