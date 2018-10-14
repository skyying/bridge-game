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
    this.update = this.update.bind(this);
    this.stopLoading = this.stopLoading.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
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
  }
  updateUserInfo(user, userInfo) {
    dispatch("UPDATE_USER_INFO", {
      user: user,
      uid: user.uid,
      userInfo: userInfo
    });
  }
  stopLoading() {
    dispatch("STOP_LOADING", {isLoad: true});
  }
  render() {
    let pathName = window.location.pathname;
    if (!this.state.isLoad) {
      return <Loading />;
    }
    // let currentUser = this.state.uid;
    let currentUser = this.state.user;
    return (
      <div>
        <BrowserRouter>
          <div>
            <Header
              isInTablePage={this.state.isInTablePage}
              isLogin={this.state.isLogin || false}
              path={pathName}
              userInfo={this.state.userInfo}
              currentUser={currentUser}
            />
            <div>
              <Route
                path="/login"
                exact
                render={props => <Login />}
              />
              <Route
                exact
                path="/signup"
                render={props => (
                  <SignUp
                    updateUserInfo={this.updateUserInfo}
                    {...props}
                  />
                )}
              />
              <Route
                exact
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
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("main"));
