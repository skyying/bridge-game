import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {getRandomKey} from "../helper/helper.js";
import {dispatch} from "../reducer/reducer.js";
import {EMPTY_SEAT} from "../components/constant.js";
import {getObj, getObjSortKey} from "../helper/helper.js";
import {app} from "../firebase/firebase.js";
import {dispatchToDatabase} from "../reducer/reducer.js";
import "../style/table-list.scss";

export default class OpenTables extends React.Component {
  constructor(props) {
    super(props);
    this.createTable = this.createTable.bind(this);
  }
  createTable(tableRef) {
    console.log("should do");
    dispatchToDatabase("CREATE_TABLE", {
      tableRef: tableRef,
      currentUser: this.props.currentUser
    });
  }
  render() {
    let tableList = this.props.tableList;
    if (!tableList) {
      return (
        <div>
          <h3>Open table</h3>
          <div> loading... </div>
          <button onClick={()=> {this.createTable(new Date().getTime())}}>Open a new table</button>
        </div>
      );
    }
    let tableListKey = Object.keys(tableList);
    let filteredList = tableListKey.filter(
      key =>
        tableList[key].players
          ? tableList[key].players.some(seat => seat === EMPTY_SEAT)
          : !tableList[key].players,
    );
    let tableLinks = filteredList.map((key, index) => {
      let players = this.props.tableList[key].players;
      let emptySeats = players
        ? players.filter(player => player === EMPTY_SEAT).length
        : 4;
      let owner = players ? players[0] : "";
      return (
        <div
          className="table-list-item"
          key={`tablelist-item-${index}}`}>
          <div>{index + 1}</div>
          <div>{owner}</div>
          <div className="empty-seats">{emptySeats} </div>
          <div>
            <Link
              className="btn-style-border"
              key={key}
              to={`/table/${key}`}>
                            Play
            </Link>
          </div>
        </div>
      );
    });
    // onClick={() => this.addPlayerToTable(key)}
    let tableRef = new Date().getTime();
    let openBtn = this.props.openBtn && (
      <Link
        className="btn-style-border"
        onClick={() => this.createTable(tableRef)}
        to={`/table/${tableRef}`}>
                Open table
      </Link>
    );

    return (
      <div className="table-list">
        {this.props.title && <h4>{this.props.title}</h4>}
        {!this.props.isLoad && (
          <div>
            <div className="table-list-item-group">loading... </div>
          </div>
        )}
        <div className="btn-group">
          <button className="btn-style">Match me</button>
        </div>
        <div className="table-list-header">
          <div>No.</div>
          <div>Owner</div>
          <div>Available seat</div>
          <div>{openBtn}</div>
        </div>
        <div className="table-list-item-group">{tableLinks}</div>
      </div>
    );
  }
}
