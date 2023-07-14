import React from "react";
import { Switch, Route } from "react-router-dom";
import Main from "./components/Main";
import Order from "./components/Order";
import Success from "./components/Success";
import "./App.css"

const App = () => {
  return (
    <div>
      <div className="header">
        <img src="../logo.svg" alt="Logo" />
      </div>
      
      <div className="main-main">

        <Switch>
          <Route exact path="/">
            <Main />
          </Route>
          <Route path="/pizza">
            <Order />
          </Route>
          <Route path="/success">
            <Success />
          </Route>
        </Switch>
      </div>

    </div >
  );
};
export default App;

