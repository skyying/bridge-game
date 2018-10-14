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
import SignUp from "./components/signUp.js";
import {
  IndexRoute,
  BrowserRouter,
  Router,
  Route,
  Switch,
  Redirect,
  Link,
  withrouter
} from "react-router-dom";
import {dispatch, store} from "./reducer/reducer.js";

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
    this.stopLoading();
    // setTimeout(this.stopLoading, 10);
  }
  handleLogin(name) {
    dispatch("HANDLE_LOGIN", {name: name});
  }
  stopLoading() {
    dispatch("STOP_LOADING", {isLoad: true});
  }
  render() {
    let pathName = window.location.pathname;
    if (!this.state.isLoad) {
      return <Loading />;
    }
    let currentUser = this.state.currentUSer;
    currentUser = "abc";

    return (
      <div>
        <BrowserRouter>
          <div>
            <Header
              isLogin={this.state.isLogin || false}
              path={pathName}
              user={this.state.currentUser}
            />
            {!currentUser && (
              <div>
                <Route
                  path="/"
                  render={props => (
                    <Login login={this.handleLogin} />
                  )}
                />
                <Route
                  path="/signup"
                  render={props => <SignUp {...props} />}
                />
              </div>
            )}
            {currentUser && (
              <div>
                <Route
                  path="/table/:id"
                  render={props => (
                    <Table
                      chatroom={this.state.chatroom}
                      tables={this.state.tables}
                      tableList={this.state.tableList}
                      currentUser={currentUser}
                      {...props}
                    />
                  )}
                />
                <Route
                  exact
                  path="/"
                  render={() => (
                    <Lobby
                      tables={this.state.tables || null}
                      currentUser={currentUser}
                      tableList={this.state.tableList}
                    />
                  )}
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
