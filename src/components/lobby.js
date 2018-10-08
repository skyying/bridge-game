import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {
  IndexRoute,
  BrowserRouter,
  Router,
  Route,
  Switch,
  Link
} from "react-router-dom";
import OpenTables from "./openTables.js";
import PlayingTables from "./playingTables.js";
import "../style/lobby.scss";
import openImg from "../images/open.svg";
import playImg from "../images/play.svg";

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="lobby">
        <div className="lobby-title">
          <h2>Welcome to Wow Bridge</h2>
        </div>
        <div className="table-lists">
          <div className="table-list-wrapper">
            <h3>Open</h3>
            <div className="table-num">
              <span>3</span> <b>tables</b>
            </div>
            <div className="table-list-inner">
              <img src={openImg} />
              <OpenTables
                title={false}
                isLoad={true}
                openBtn={true}
                currentUser={this.props.currentUser}
                open={true}
                tableList={this.props.tableList}
              />
            </div>
          </div>
          <div className="table-list-wrapper">
            <h3>Playing</h3>
            <div className="table-num">
              <span>3</span> <b>tables</b>
            </div>
            <div className="table-list-inner">
              <img src={playImg} />
              <PlayingTables
                title={false}
                isLoad={true}
                openBtn={true}
                open={false}
                currentUser={this.props.currentUser}
                tableList={this.props.tableList}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// <TableList
//   currentUser={this.props.currentUser}
//   tableList={this.props.tableList}
// />
