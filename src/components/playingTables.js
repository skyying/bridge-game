import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {dispatch, dispatchToDatabase} from "../reducer/reducer.js";
import TableLogic from "../logic/tableLogic.js";
import "../style/table-list.scss";

export default class PlayingTables extends React.Component {
  constructor(props) {
    super(props);
    ["createTable", "setCurrentTable"].forEach(name => {
      this[name] = this[name].bind(this);
    });
  }
  createTable(linkId) {
    dispatchToDatabase("CREATE_TABLE", {
      linkId: linkId,
      currentUser: this.props.currentUser
    });
  }
  setCurrentTable(id) {
    if (this.props.currentUser) {
      dispatch("UPDATE_CURRENT_TABLE_ID", {currentTableId: id});
    }
  }
  render() {
    let tableList = this.props.tableList;
    let tableLinks;
    let allTables = new TableLogic(this.props.tableList);
    if (tableList && allTables.playing) {
      tableLinks = allTables.playing.map((table, index) => {
        let {roomId, linkId, players} = table;
        let playerList = players.map((name, index) => (
          <div key={`playerSeat-${index}`}>{name}</div>
        ));
        return (
          <div
            className="playing-table"
            key={`playing-table-item-${index}}`}>
            <div className="room-number">
              <span>{roomId}</span>
            </div>
            {playerList}
            <div>
              <Link
                onClick={() => this.setCurrentTable(linkId)}
                className="btn-style-border"
                to={
                  this.props.currentUser
                    ? `/table/${linkId}`
                    : "/login"
                }>
                                觀賞
              </Link>
            </div>
          </div>
        );
      });
    }
    return (
      <div className="table-list">
        <h4>{this.props.title}</h4>
        <div className="table-list-header playing-table-header">
          <div>房號</div>
          <div>南</div>
          <div>西</div>
          <div>北</div>
          <div>東</div>
          <div />
        </div>
        <div className="table-list-item-group">{tableLinks}</div>
      </div>
    );
  }
}
