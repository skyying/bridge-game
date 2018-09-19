import "./style/main.scss";
import React from "react";
import ReactDOM from "react-dom";
import Game from "./components/game.js";
import Login from "./components/login.js";
import CreateTable from "./components/createTable.js";
import Table from "./components/table.js";
import Header from "./components/header.js";
import Lobby from "./components/lobby.js";
import Loading from "./components/loading.js";
import {
  IndexRoute,
  BrowserRouter,
  Router,
  Route,
  Switch,
  Link
} from "react-router-dom";
import { dispatch, store } from "./reducer/reducer.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = store.getState();
    this.handleLogin = this.handleLogin.bind(this);
    this.update = this.update.bind(this);
    this.stopLoading = this.stopLoading.bind(this);
  }
  update() {
    this.setState(store.getState());
  }
  componentDidUnMount() {
    this.unSubscribe();
  }
  componentDidMount() {
    this.unSubscribe = store.subscribe(this.update.bind(this));
    setTimeout(this.stopLoading, 10);
  }
  handleLogin(name) {
    dispatch("HANDLE_LOGIN", { name: name });
  }
  stopLoading() {
    dispatch("STOP_LOADING", { isLoad: true });
  }
  render() {
    console.log("in state");
    console.log(this.state);
    if (!this.state.isLoad) {
      return <Loading />;
    }
    console.log("--------------");
    console.log(this.state.currentUser);
    return (
      <div>
        <BrowserRouter>
          <div>
            <Header user={this.state.currentUser} />
            {!this.state.currentUser && (
              <Route
                path="/"
                render={props => (
                  <Login login={this.handleLogin} />
                )}
              />
            )}
            {this.state.currentUser && (
              <div>
                <Route
                  path="/table/:id"
                  render={props => (
                    <Table
                      tables={this.state.tables}
                      {...props}
                    />
                  )}
                />
                <Route
                  exact
                  path="/lobby"
                  render={() => (
                    <Lobby tables={this.state.tables} />
                  )}
                />
                <Route
                  exact
                  path="/createTable"
                  render={() => <CreateTable />}
                />
              </div>
            )}
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("main"));
