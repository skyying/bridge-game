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
import {EMPTY_SEAT} from "./constant.js";
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
    let open = 0,
      playing = 0;
    if (this.props.tableList) {
      open = Object.keys(this.props.tableList).filter(key => {
        if (
          this.props.tableList[key] &&
                    this.props.tableList[key].players
        ) {
          return this.props.tableList[key].players.some(
            player => player === EMPTY_SEAT
          );
        }
        return false;
      }).length;
    }
    return (
      <div className="lobby">
        <div className="lobby-title">
          <h2>Welcome to Wow Bridge</h2>
        </div>
        <div className="table-lists">
          <div className="table-list-wrapper">
            <h3>Open</h3>
            <div className="table-num" />
            <div className="table-list-inner">
              <img src={openImg} />
              <OpenTables
                title={"Join A Table To Play"}
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
            <div className="table-num" />
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
// <span>3</span> <b>tables</b>
