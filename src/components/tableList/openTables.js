import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {dispatch, dispatchToDatabase} from "../../reducer";
import TableLogic from "../../logic/tableLogic.js";
import AnonymousPlayer from "../../logic/anonymousPlayer.js";
import "../../style/table-list.scss";

export default class OpenTables extends React.Component {
  constructor(props) {
    super(props);

    ["createTable", "setCurrentTable", "validateCurrentUser"].forEach(
      name => {
        this[name] = this[name].bind(this);
      }
    );
  }
  validateCurrentUser() {
    let {currentUser} = this.props;
    // allow anonymous user to play
    if (!currentUser) {
      currentUser = new AnonymousPlayer();
      dispatch("UPDATE_USER_INFO", {
        user: currentUser,
        displayName: currentUser.displayName
      });
    }
    return currentUser;
  }
  createTable(linkId) {
    let currentUser = this.validateCurrentUser();
    dispatchToDatabase("CREATE_TABLE", {
      linkId: linkId,
      currentUser: currentUser
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
                                Join
              </Link>
            </div>
          </div>
        );
      });
    }
    let tableRef = new Date().getTime();
    let openBtn = this.props.openBtn && (
      <Link
        className="btn-style-border"
        onClick={() => this.createTable(tableRef)}
        to={`/table/${tableRef}`}>
                New table
      </Link>
    );

    return (
      <div className="table-list">
        {this.props.title && <h4>{this.props.title}</h4>}
        <div className="table-list-header">
          <div>Table</div>
          <div>Owner</div>
          <div>Empty Seats</div>
          <div className="open-table-section">{openBtn}</div>
        </div>
        <div className="table-list-item-group">{tableLinks}</div>
      </div>
    );
  }
}
