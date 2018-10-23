import React from "react";
import PropTypes from "prop-types";
import {ThumbnailWithTag} from "./thumbnail.js";
import {DB} from "../firebase/db.js";
import {Link} from "react-router-dom";
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
    DB.auth.signOut();
  }
  closePanel() {
    this.setState({isOpen: false});
  }
  render() {
    let {currentUser} = this.props;
    return (
      <div className="user-state-panel">
        <div
          className={
            this.state.isOpen
              ? "Login-state-btn open-btn"
              : "Login-state-btn"
          }
          onClick={() => this.setState({isOpen: !this.state.isOpen})}>
          <ThumbnailWithTag
            isCurrentUser={true}
            size={40}
            offset={5}
            name={(currentUser && currentUser.displayName) || ""}
          />
          <div>
            <h6>{currentUser.displayName}</h6>
            <span>線上</span>
          </div>
        </div>
        <div className={this.state.isOpen ? "options open" : "options"}>
          <Link onClick={this.handleSignOut} to="/">
                登出
          </Link>
        </div>
      </div>
    );
  }
}
