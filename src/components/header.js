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
    let _this = this;
    if (!this.props.currentUser) {
      this.props.getUserAuthInfo().then(user => {
        console.log("in fetched");
        console.log(_this.props.currentUser);
        _this.setState({isLoad: true});
      });
    }
  }
  updateHeader() {
    dispatch("SET_CURRENT_HEADER", {isInTablePage: false});
  }
  render() {
    let userProfile = (
      <UserState
        updateHeader={this.updateHeader}
        uid={this.props.uid}
        currentUser={this.props.currentUser}
        userList={this.props.userList}
      />
    );
    let rightTopCorner;
    let registerBtns = (
      <div className="register-btn-groups">
        <Link onClick={this.updateHeader} to="/signup">
          註冊
        </Link>
        <Link onClick={this.updateHeader} to="/login">
          登入
        </Link>
      </div>
    );
    rightTopCorner = this.props.uid ? userProfile : registerBtns;
    return (
      <header className={this.props.isInTablePage ? "table-header" : ""}>
        <div>
          <Link to="/" onClick={this.updateHeader}>
            <img src={logoImg} />
            <h1>Wow Bridge</h1>
          </Link>
        </div>
        <div>
          <div>{rightTopCorner}</div>
        </div>
      </header>
    );
  }
}
