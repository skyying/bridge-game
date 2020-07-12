import "./style/main.scss";
import React from "react";
import ReactDOM from "react-dom";
import Login from "./components/login";
import SignUp from "./components/signUp";
import Table from "./components/table.js";
import Lobby from "./components/lobby.js";
import Loading from "./components/common/loading.js";
import {Route, HashRouter} from "react-router-dom";
import {dispatch, store} from "./reducer";
import {initializeReactGA} from "./firebase/config.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = store.getState();
    ["update", "stopLoading", "updateUserInfo"].forEach(name => {
      this[name] = this[name].bind(this);
    });
  }
  // update state
  update() {
    this.setState(store.getState());
  }

  // stop loading, register google analytics events, subscribe redux event
  componentDidMount() {
    this.unSubscribe = store.subscribe(this.update.bind(this));
    this.stopLoading();
    initializeReactGA();
  }
  // unSubscribe redux event
  componentDidUnMount() {
    this.unSubscribe();
  }
  // a method to update current login user information to state
  updateUserInfo(user, userInfo) {
    dispatch("UPDATE_USER_INFO", {
      user: user,
      userInfo: userInfo
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
                    isSidebarPanelShown={
                      this.state.isSidebarPanelShown
                    }
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
                render={(props) => (
                  <Lobby
                    isLoad={this.state.isLoad}
                    tables={this.state.tables || null}
                    currentUser={this.state.user}
                    isHeaderPanelClosed={
                      this.state.isHeaderPanelClosed
                    }
                    tableList={this.state.tableList}
                    {...props}
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
