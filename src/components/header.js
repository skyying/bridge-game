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
    if (!this.props.currentUser) {
      this.props.getUserAuthInfo().then(user => {
        console.log("user login");
      });
    }
  }
  render() {
    let userProfile = (
      <UserState
        isHeaderPanelClosed={this.props.isHeaderPanelClosed}
        currentUser={this.props.currentUser}
      />
    );
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
    let {roomNum} = this.props;
    let roomInfo = null;
    if (roomNum) {
      roomNum = `${roomNum}`;
      roomInfo =
                "桌號 " + roomNum.slice(roomNum.length - 3, roomNum.length);
    }
    return (
      <header className={this.props.isTableColor ? "table-header" : ""}>
        <div>
          <Link to="/">
            <img src={logoImg} />
            <h1>Wow Bridge</h1>
          </Link>
        </div>
        <div>
          <h3>{roomInfo}</h3>
        </div>
        <div>
          <div>{rightTopCorner}</div>
        </div>
      </header>
    );
  }
}
