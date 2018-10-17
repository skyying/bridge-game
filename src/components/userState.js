import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {Thumbnail} from "./thumbnail.js";
import {app} from "../firebase/firebase.js";
import {Link} from "react-router-dom";
import {dispatch} from "../reducer/reducer.js";
import "../style/user-state.scss";

export default class UserState extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.handleSignOut = this.handleSignOut.bind(this);
    this.closePanel = this.closePanel.bind(this);
  }
  handleSignOut() {
    this.closePanel();
    app.auth.signOut();
  }
  closePanel() {
    this.setState({isOpen: false});
  }

  render() {
    let {currentUser, userList} = this.props;
    if (userList && userList[currentUser.uid]) {
      name = userList[currentUser.uid].displayName;
    }
    if (!name) {
      name === "";
    }
    return (
      <div className="user-state-panel">
        <div
          className={
            this.state.isOpen
              ? "Login-state-btn open-btn"
              : "Login-state-btn"
          }
          onClick={() => this.setState({isOpen: !this.state.isOpen})}>
          <Thumbnail size={40} offset={5} name={name} />
          <div>
            <h6>{this.props.currentUser.displayName}</h6>
            <span>online</span>
          </div>
        </div>
        <div className={this.state.isOpen ? "options open" : "options"}>
          <Link onClick={this.handleSignOut} to="/">
                        Sign out
          </Link>
        </div>
      </div>
    );
  }
}
