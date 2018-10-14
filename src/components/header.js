import "../style/reset.scss";
import "../style/header.scss";
import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import logoImg from "../images/logo.png";
import {dispatch} from "../reducer/reducer.js";
import UserState from "./userState.js";

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.updateHeader = this.updateHeader.bind(this);
  }
  updateHeader() {
    dispatch("SET_CURRENT_HEADER", {isInTablePage: false});
  }
  render() {
    let userProfile = (
      <UserState
        uid={this.props.uid}
        currentUser={this.props.currentUser}
        userList={this.props.userList}
      />
    );
    let rightTopCorner;
    let registerBtns = (
      <div className="register-btn-groups">
        <Link onClick={this.updateHeader} to="/signup">
                    Sign up
        </Link>
        <Link onClick={this.updateHeader} to="/login">
                    Log in
        </Link>
      </div>
    );
    rightTopCorner = this.props.uid ? userProfile : registerBtns;
    return (
      <header className={this.props.isInTablePage ? "table-header" : ""}>
        <div>
          <Link to="/" onClick={this.updateHeader}>
            <img src={logoImg} />
            <h1>Bridge Together</h1>
          </Link>
        </div>
        <div>
          <div>{rightTopCorner}</div>
        </div>
      </header>
    );
  }
}
