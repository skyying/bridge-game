import "../style/reset.scss";
import "../style/header.scss";
import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import logoImg from "../images/logo.svg";
import {dispatch} from "../reducer/reducer.js";
import UserState from "./userState.js";

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    let _this = this;
    if (!this.props.currentUser) {
      this.props.getUserAuthInfo().then(user => {
        console.log(_this.props.currentUser);
        _this.setState({isLoad: true});
      });
    }
  }
  render() {
    let userProfile = <UserState currentUser={this.props.currentUser} />;
    let rightTopCorner;
    let registerBtns = (
      <div className="register-btn-groups">
        <Link to="/signup">註冊</Link>
        <Link to="/login">登入</Link>
      </div>
    );
    rightTopCorner =
            this.props.currentUser && this.props.currentUser.uid
              ? userProfile
              : registerBtns;
    return (
      <header className={this.props.isTableColor ? "table-header" : ""}>
        <div>
          <Link to="/">
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
