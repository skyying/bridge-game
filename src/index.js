import "./style/main.scss";
import React from "react";
import ReactDOM from "react-dom";
import Login from "./components/login.js";
import Table from "./components/table.js";
import {Lobby} from "./components/lobby.js";
import {Loading} from "./components/loading.js";
import SignUp from "./components/signUp.js";
import {DB} from "./firebase/db.js";
import {Route, HashRouter} from "react-router-dom";
import {dispatch, store} from "./reducer/reducer.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = store.getState();
    [
      "update",
      "stopLoading",
      "updateUserInfo",
      "getUserAuthInfo",
      "getUserAuthInfo"
    ].forEach(name => {
      this[name] = this[name].bind(this);
    });
  }
  update() {
    this.setState(store.getState());
  }
  componentDidMount() {
    this.unSubscribe = store.subscribe(this.update.bind(this));
    this.stopLoading();
  }
  componentDidUnMount() {
    this.unSubscribe();
  }
  updateUserInfo(user, userInfo) {
    dispatch("UPDATE_USER_INFO", {
      user: user,
      userInfo: userInfo
    });
  }
  getUserAuthInfo() {
    let _this = this;
    return new Promise((resolve, reject) => {
      DB.auth.onAuthStateChanged(user => {
        if (user) {
          DB.getDataByPathOnce(`users/${user.uid}`, snapshot => {
            let userInfo = snapshot.val();
            resolve(userInfo);
            _this.stopLoading();
            dispatch("UPDATE_USER_INFO", {
              user: user,
              userInfo: snapshot.val()
            });
          });
        } else {
          reject(true);
          _this.stopLoading();
          return dispatch("UPDATE_USER_INFO", {
            userInfo: null,
            user: null
          });
        }
        dispatch("UPDATE_LOADING_STATE", {isLoad: true});
      });
    });
  }
  closeHeaderPanel(e) {
    dispatch("TOGGLE_HEADER_PANEL", {isToggle: false});
  }
  stopLoading() {
    dispatch("UPDATE_LOADING_STATE", {isLoad: true});
  }
  render() {
    if (!this.state.isLoad) {
      return <Loading />;
    }
    return (
      <div className="main" onClick={this.closeHeaderPanel}>
        <HashRouter>
          <div>
            <div>
              <Route
                path="/login"
                exact
                render={props => (
                  <Login
                    getUserAuthInfo={this.getUserAuthInfo}
                    isHeaderPanelClosed={
                      this.state.isHeaderPanelClosed
                    }
                    currentUser={this.state.user}
                  />
                )}
              />
              <Route
                exact
                path="/signup"
                render={props => (
                  <SignUp
                    updateUserInfo={this.updateUserInfo}
                    getUserAuthInfo={this.getUserAuthInfo}
                    isHeaderPanelClosed={
                      this.state.isHeaderPanelClosed
                    }
                    currentUser={this.state.user}
                    {...props}
                  />
                )}
              />
              <Route
                path="/table/:id"
                render={props => (
                  <Table
                    currentTableId={
                      this.state.currentTableId
                    }
                    isChatroomShown={
                      this.state.isChatroomShown
                    }
                    getUserAuthInfo={this.getUserAuthInfo}
                    chatroom={this.state.chatroom}
                    tables={this.state.tables}
                    tableList={this.state.tableList}
                    currentUser={this.state.user}
                    isHeaderPanelClosed={
                      this.state.isHeaderPanelClosed
                    }
                    {...props}
                  />
                )}
              />
              <Route
                exact
                path="/"
                render={() => (
                  <Lobby
                    isLoad={this.state.isLoad}
                    getUserAuthInfo={this.getUserAuthInfo}
                    tables={this.state.tables || null}
                    currentUser={this.state.user}
                    isHeaderPanelClosed={
                      this.state.isHeaderPanelClosed
                    }
                    tableList={this.state.tableList}
                  />
                )}
              />
            </div>
          </div>
        </HashRouter>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("main"));
