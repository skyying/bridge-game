import React from "react";
import PropTypes from "prop-types";
import {ThumbnailWithTag} from "./thumbnail.js";
import {DB} from "../firebase/db.js";
import {Link} from "react-router-dom";
import "../style/user-state.scss";
import {dispatch} from "../reducer/reducer.js";

export default class UserState extends React.Component {
  constructor(props) {
    super(props);

    ["handleSignOut", "togglePanel"].forEach(name => {
      this[name] = this[name].bind(this);
    });
  }
  handleSignOut() {
    this.togglePanel();
    DB.auth.signOut();
  }
  togglePanel(e) {
    if (e) {
      e.stopPropagation();
    }
    dispatch("TOGGLE_HEADER_PANEL", {isToggle: true});
  }
  render() {
    let {currentUser} = this.props;
    return (
      <div className="user-state-panel">
        <div
          className={
            this.props.isHeaderPanelClosed
              ? "Login-state-btn"
              : "Login-state-btn open-btn"
          }
          onClick={this.togglePanel}>
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
        <div
          className={
            this.props.isHeaderPanelClosed
              ? "options"
              : "options open"
          }>
          <Link onClick={this.handleSignOut} to="/">
                        登出
          </Link>
        </div>
      </div>
    );
  }
}
