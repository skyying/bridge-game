import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import GameRecord from "./gameRecord.js";
import GameRewind from "./gameRewind.js";
import {TAB_OPTION} from "../constant.js";

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0
    };
  }
  render() {
    if (!this.props.table) return null;
    let options = TAB_OPTION.map((opt, i) => (
      <div
        className={this.state.current === i ? "current" : ""}
        key={`opt-${i}`}>
        {opt}
      </div>
    ));
    return (
      <div className="sidebar">
        <div className="tabs">{options}</div>
        <GameRecord
          players={this.props.table.players}
          record={this.props.table.record || null}
        />
        <GameRewind record={this.props.table.record || null} />
      </div>
    );
  }
}
