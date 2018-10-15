import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {getRandomKey} from "../helper/helper.js";
import {dispatch, dispatchToDatabase} from "../reducer/reducer.js";
import {EMPTY_SEAT} from "../components/constant.js";
import {getObj, getObjSortKey} from "../helper/helper.js";
import {app} from "../firebase/firebase.js";
import "../style/table-list.scss";

export default class OpenTables extends React.Component {
  constructor(props) {
    super(props);
    this.createTable = this.createTable.bind(this);
    this.updateHeader = this.updateHeader.bind(this);
    this.setCurrentTable = this.setCurrentTable.bind(this);
  }
  updateHeader() {
    let val = false;
    if (this.props.currentUser) {
      val = true;
    }
    dispatch("SET_CURRENT_HEADER", {isInTablePage: val});
  }
  createTable(tableRef) {
    dispatchToDatabase("CREATE_TABLE", {
      tableRef: tableRef,
      currentUser: this.props.currentUser
    });
  }
  setCurrentTable(id) {
    this.updateHeader();
    if (this.props.currentUser) {
      dispatch("UPDATE_CURRENT_TABLE_ID", {currentTableId: id});
    }
  }
  render() {
    let {tableList} = this.props;
    let tableLinks;
    if (tableList) {
      let tableListKey = Object.keys(tableList);
      let playingTables = tableListKey.filter(
        key =>
          tableList[key].players &&
                    !tableList[key].players.some(
                      player => player === EMPTY_SEAT
                    )
      );
      tableLinks = playingTables.map((key, index) => {
        let {players, playerInfo} = this.props.tableList[key];
        let playerList = players.map((playerKey, index) => (
          <div key={`playerSeat-${index}`}>
            {playerInfo[playerKey]
              ? playerInfo[playerKey].displayName
              : "Anonymous"}
          </div>
        ));
        return (
          <div
            className="playing-table"
            key={`playing-table-item-${index}}`}>
            <div>{index + 1}</div>
            {playerList}
            <div>
              <Link
                onClick={() => this.setCurrentTable(key)}
                className="btn-style-border"
                to={
                  this.props.currentUser
                    ? `/table/${key}`
                    : "/login"
                }>
                                View
              </Link>
            </div>
          </div>
        );
      });
    }
    return (
      <div className="table-list">
        <h4>Live</h4>
        <div className="table-list-header playing-table-header">
          <div>No.</div>
          <div>South</div>
          <div>West</div>
          <div>North</div>
          <div>East</div>
          <div />
        </div>
        <div className="table-list-item-group">{tableLinks}</div>
      </div>
    );
  }
}
