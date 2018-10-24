import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {TIMER} from "./constant.js";
import {dispatch, dispatchToDatabase} from "../reducer/reducer.js";
import {EMPTY_SEAT} from "../components/constant.js";

import "../style/table-list.scss";

export default class OpenTables extends React.Component {
  constructor(props) {
    super(props);
    this.createTable = this.createTable.bind(this);
    this.setCurrentTable = this.setCurrentTable.bind(this);
  }
  createTable(tableRef) {
    if (!this.props.currentUser) {
      console.log(" no user login");
      return;
    }
    dispatchToDatabase("CREATE_TABLE", {
      tableRef: tableRef,
      currentUser: this.props.currentUser
    });
    this.setCurrentTable(tableRef);
  }
  setCurrentTable(id) {
    if (this.props.currentUser) {
      dispatch("UPDATE_CURRENT_TABLE_ID", {currentTableId: id});
    }
  }
  render() {
    let tableList = this.props.tableList;

    let tableLinks;

    if (tableList) {
      let tableListKey = Object.keys(tableList);

      let openTableList = tableListKey.filter(key => {
        let tableCreateTime = +key;

        if (
          tableList[key].players
        //&& new Date().getTime() - tableCreateTime <= TIMER.join
        ) {
          return tableList[key].players.some(
            seat => seat === EMPTY_SEAT
          );
        } else {
          return !tableList[key].players;
        }
      });

      let PLAYER_NUM = 4;
      let ROOM_NUM_LEN = 3;

      tableLinks = openTableList.map((key, index) => {
        let roomNum = key.slice(key.length - ROOM_NUM_LEN, key.length);
        let players = this.props.tableList[key].players;
        let playerInfo = this.props.tableList[key].playerInfo;
        let emptySeats = players
          ? players.filter(player => player === EMPTY_SEAT).length
          : PLAYER_NUM - 1;

        let owner = playerInfo[players[0]].displayName;
        return (
          <div
            className="table-list-item"
            key={`tablelist-item-${index}}`}>
            <div className="room-number">
              <span>{roomNum}</span>
            </div>
            <div>{owner}</div>
            <div className="empty-seats">{emptySeats} </div>
            <div>
              <Link
                className="btn-style-border"
                onClick={() => this.setCurrentTable(key)}
                key={key}
                to={
                  this.props.currentUser
                    ? `/table/${key}`
                    : "/login"
                }>
                                加入
              </Link>
            </div>
          </div>
        );
      });
    }

    let tableRef = new Date().getTime();
    let openBtn = this.props.currentUser &&
            this.props.openBtn && (
      <Link
        className="btn-style-border"
        onClick={() => this.createTable(tableRef)}
        to={
          this.props.currentUser ? `/table/${tableRef}` : "/login"
        }>
                    我要開桌
      </Link>
    );

    return (
      <div className="table-list">
        {this.props.title && <h4>{this.props.title}</h4>}
        <div className="table-list-header">
          <div>房號</div>
          <div>桌長</div>
          <div>空位</div>
          <div className="open-table-section">{openBtn}</div>
        </div>
        <div className="table-list-item-group">{tableLinks}</div>
      </div>
    );
  }
}
