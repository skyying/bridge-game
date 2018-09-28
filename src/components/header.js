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
    this.startNewGame = this.startNewGame.bind(this);
  }
  startNewGame() {
    console.log("start a new game");
    let newGame = {
      bid: {
        isDb: false,
        isRdb: false,
        trick: 0,
        trump: -1
      },
      deal: 0,
      order: -1,
      players: ["1", "2", "3", "leslie"]
    };

    dispatchToDatabase("CREATE_NEW_GAME", {
      id: 0,
      game: [newGame]
    });
  }
  render() {
    console.log("COMP: Header");
    return (
      <header>
        <div>
          <Link to="/">
            <img src={logoImg} />
            <h1>Bridge Together</h1>
          </Link>
        </div>
        <a onClick={this.startNewGame}>reset</a>
        <div>
          <img src={messageSvg} />
          <div>{this.props.user || "Sign In / Sign Up"}</div>
        </div>
      </header>
    );
  }
}
