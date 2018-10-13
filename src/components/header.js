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
    return (
      <header className={this.props.path.includes("table") ? 
        "table-header" : ""} >
        <div>
          <Link to="/lobby">
            <img src={logoImg} />
            <h1>Bridge Together</h1>
          </Link>
        </div>
        <div>
          <img src={messageSvg} />
          <div>{this.props.user || "Sign In / Sign Up"}</div>
        </div>
      </header>
    );
  }
}
