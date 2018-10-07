import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import GameRecord from "./gameRecord.js";
import GameRewind from "./gameRewind.js";
import {TAB_OPTION} from "../constant.js";

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    let {record} = this.props.table;
    this.state = {
      tab: 0,
      currentRecord: record ? record.length - 1 : null
    };
    this.changeRecord = this.changeRecord.bind(this);
  }
  changeRecord(index) {
    this.setState({currentRecord: index});
  }
  render() {
    if (!this.props.table) return null;
    let options = TAB_OPTION.map((opt, i) => (
      <div
        className={this.state.tab === i ? "current" : ""}
        key={`opt-${i}`}>
        {opt}
      </div>
    ));
    let currentRecord =
            this.state.currentRecord >= 0 &&
            this.props.table.record[this.state.currentRecord];
    return (
      <div className="sidebar">
        <div className="tabs">{options}</div>
        <GameRecord
          players={this.props.table.players}
          record={this.props.table.record || null}
          changeRecord={this.changeRecord}
          currentRecord={this.state.currentRecord}
        />
        <GameRewind
          players={this.props.table.players}
          record={currentRecord}
        />
      </div>
    );
  }
}
