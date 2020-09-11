import React, { useEffect, Fragment } from "react";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import ChangePassword from "./components/auth/ChangePassword";
import MembersAdministrator from "./components/pages/MembersAdministrator";
import Home from "./components/pages/Home";
import News from "./components/pages/News/News";
import NewsAdministrator from "./components/pages/News/NewsAdministrator";
import About from "./components/pages/About";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/routing/PrivateRoute";
import setAuthToken from "./utils/setAuthToken";
import "materialize-css/dist/css/materialize.min.css";
import M from "materialize-css/dist/js/materialize.min.js";
import "./App.css";
import { Provider } from "react-redux";
import store from "./store";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    M.AutoInit();
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Switch>
            <PrivateRoute exact path='/' component={Home} />
            <PrivateRoute exact path='/news' component={News} />
            <PrivateRoute
              exact
              path='/news-administrator'
              component={NewsAdministrator}
            />
            <PrivateRoute
              exact
              path='/change-password'
              component={ChangePassword}
            />
            <PrivateRoute
              exact
              path='/member-administrator'
              component={MembersAdministrator}
            />
            <Route exact path='/about' component={About} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
