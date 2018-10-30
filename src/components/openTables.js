import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {dispatch, dispatchToDatabase} from "../reducer/reducer.js";
import TableLogic from "../logic/tableLogic.js";
import "../style/table-list.scss";

export default class OpenTables extends React.Component {
  constructor(props) {
    super(props);
    this.createTable = this.createTable.bind(this);
    this.setCurrentTable = this.setCurrentTable.bind(this);
  }
  createTable(linkId) {
    if (!this.props.currentUser) {
      return;
    }
    dispatchToDatabase("CREATE_TABLE", {
      linkId: linkId,
      currentUser: this.props.currentUser
    });
    this.setCurrentTable(linkId);
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
    if (tableList && allTables.open) {
      tableLinks = allTables.open.map((table, index) => {
        let {roomId, owner, availableSeats, linkId} = table;
        return (
          <div
            className="table-list-item"
            key={`tablelist-item-${index}}`}>
            <div className="room-number">
              <span>{roomId}</span>
            </div>
            <div>{owner}</div>
            <div className="empty-seats">{availableSeats} </div>
            <div>
              <Link
                className="btn-style-border"
                onClick={() => this.setCurrentTable(linkId)}
                key={linkId}
                to={
                  this.props.currentUser
                    ? `/table/${linkId}`
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
