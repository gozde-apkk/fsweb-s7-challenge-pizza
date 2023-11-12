import React from "react";
import { Switch, Route } from "react-router-dom";
import Main from "./components/Main";
import Order from "./components/Order";
import Success from "./components/Success";
import MainPage from "./components/MainPage";
import "./App.css"

const App = () => {
  return (
    <div>
      <div className="main-main">

        <Switch>
          <Route exact path="/">
            <Main />
            <MainPage/>
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

