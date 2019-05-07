import React from "react";
import PropTypes from "prop-types";
import {ThumbnailWithTag} from "../thumbnail";
import {Link} from "react-router-dom";
import "../../style/user-state.scss";
import {dispatch} from "../../reducer";
import CurrentUserFetcher from "../../logic/currentUserFetcher.js";

export default class UserState extends React.Component {
  constructor(props) {
    super(props);
    ["handleSignOut", "togglePanel"].forEach(name => {
      this[name] = this[name].bind(this);
    });
  }
  handleSignOut() {
    this.togglePanel();
    let currentUser = new CurrentUserFetcher(this.props.currentUser);
    currentUser.clear();
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
    if (currentUser) {
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
            <span>
              { currentUser && currentUser.isAnonymous
                ? "anonymous user"
                : "online"}
            </span>
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
