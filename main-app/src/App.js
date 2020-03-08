import React from "react";
import { Router, Route, IndexRoute, Link, hashHistory } from "react-router";

const App = props => {
  return (
    <div>
      <h1>Main app</h1>
      <ul>
        <li>
          <Link to="/">Main</Link>
        </li>
        <li>
          <Link to="/subapp/my-app-1">my app 1</Link>
        </li>
        <li>
          <Link to="/subapp/my-app-2">my app 2</Link>
        </li>
        <li>
          <Link to="/subapp/my-app-2/inbox">my app 2 inbox</Link>
        </li>
      </ul>
      {props.children}
    </div>
  );
};

const Home = () => {
  return <div>Main App Home</div>;
};

const subAppMapInfo = {
  "my-app-1": {
    js: [
      "http://127.0.0.1:7100/static/js/bundle.js",
      "http://127.0.0.1:7100/static/js/0.chunk.js",
      "http://127.0.0.1:7100/static/js/main.chunk.js"
    ]
  },
  "my-app-2": {
    js: [
      "http://127.0.0.1:7200/static/js/bundle.js",
      "http://127.0.0.1:7200/static/js/0.chunk.js",
      "http://127.0.0.1:7200/static/js/main.chunk.js"
    ]
  }
};

window.subappRoutes = {};

const subappRoutes = window.subappRoutes;

const loadAsyncSubapp = async id => {
  const arr = subAppMapInfo[id].js.map(url => loadJs(url));
  await Promise.all(arr);
};
const getChildRoutes = (location, cb) => {
  const { pathname } = location.location;
  // 取路径中标识子工程前缀的部分, 例如 '/subapp/xxx/index' 其中xxx即路由唯一前缀
  const id = pathname.split("/")[2];

  if (subAppMapInfo[id]) {
    if (subappRoutes[id]) {
      // 如果已经加载过该子工程的模块，则不再加载，直接取缓存的routes
      cb(null, [subappRoutes[id]]);
      return;
    }

    // 如果能匹配上前缀则加载相应子工程模块
    loadAsyncSubapp(id)
      .then(() => {
        const route = subappRoutes[id];
        if (!route) return;
        // 加载子工程完成
        cb(null, [route]);
      })
      .catch(() => {
        // 如果加载失败
        console.log("loading failed");
      });
  } else {
    // 可以重定向到首页去
    // goBackToIndex();
  }
};

const TheRouter = () => {
  return (
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="/subapp" getChildRoutes={getChildRoutes} />
      </Route>
    </Router>
  );
};

export default TheRouter;

const loadJsPromises = {};
function loadJs(url) {
  if (loadJsPromises[url]) return loadJsPromises[url];
  const p = new Promise(function(resolve, reject) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState) {
      //IE
      script.onreadystatechange = function() {
        if (
          script.readyState === "loaded" ||
          script.readyState === "complete"
        ) {
          script.onreadystatechange = null;
          resolve();
        }
      };
    } else {
      //Others
      script.onload = function() {
        resolve();
      };
      script.onerror = function() {
        reject();
        loadJsPromises[url] = null;
      };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  });
  loadJsPromises[url] = p;
  return p;
}
