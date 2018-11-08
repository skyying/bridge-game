import React from "react";
import PropTypes from "prop-types";
import {ThumbnailWithTag} from "../thumbnail";
import Database from "../../firebase";
import {Link} from "react-router-dom";
import "../../style/user-state.scss";
import {dispatch} from "../../reducer";

export default class UserState extends React.Component {
  constructor(props) {
    super(props);
    ["handleSignOut", "togglePanel"].forEach(name => {
      this[name] = this[name].bind(this);
    });
  }
  handleSignOut() {
    this.togglePanel();
    Database.auth.signOut();
    dispatch("UPDATE_USER_INFO", {
      user: null
    });
  }
  togglePanel(e) {
    if (e) {
      e.stopPropagation();
    }
    dispatch("TOGGLE_HEADER_PANEL", {isToggle: true});
  }
  render() {
    let {currentUser} = this.props;
    let name = "";
    if (this.props.name) {
      name = this.props.name;
    } else if (
      this.props.currentUser &&
            this.props.currentUser.displayName
    ) {
      name = currentUser.displayName;
    }

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
            name={name}
          />
          <div>
            <h6>{name}</h6>
            <span>online</span>
          </div>
        </div>
        <div
          className={
            this.props.isHeaderPanelClosed
              ? "options"
              : "options open"
          }>
          <Link onClick={this.handleSignOut} to="/">
                        Log out
          </Link>
        </div>
      </div>
    );
  }
}
