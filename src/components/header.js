import "../style/reset.scss";
import "../style/header.scss";
import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import logoImg from "../images/logo.png";
import messageSvg from "../images/message.svg";
import {dispatchToDatabase} from "../reducer/reducer.js";

export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let userProfile = <div> this.props.user </div>;
    let rightTopCorner;
    let registerBtns = (
      <div>
        <Link to="/signup"> Sign up </Link>
        <Link to="/login"> Login </Link>
      </div>
    );
    rightTopCorner = this.props.isLogin ? userProfile : registerBtns;
    return (
      <header
        className={
          this.props.path.includes("table") ? "table-header" : ""
        }>
        <div>
          <Link to="/">
            <img src={logoImg} />
            <h1>Bridge Together</h1>
          </Link>
        </div>
        <div>
          <img src={messageSvg} />
          <div>{rightTopCorner}</div>
        </div>
      </header>
    );
  }
}
