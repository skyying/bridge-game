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
    dispatchToDatabase("CREATE_TABLE", {
      tableRef: tableRef,
      currentUser: this.props.currentUser
    });
  }
  render() {
    let {tableList} = this.props;
    if (!tableList) {
      return (
        <div>
          <h3>Open table</h3>
          <div> loading... </div>
          <button>Open a new table</button>
        </div>
      );
    }
    let tableListKey = Object.keys(tableList);
    let playingTables = tableListKey.filter(
      key =>
        tableList[key].players &&
                !tableList[key].players.some(player => player === EMPTY_SEAT),
    );
    let tableLinks = playingTables.map((key, index) => {
      let players = this.props.tableList[key].players;
      let [south, west, north, east] = players;
      return (
        <div
          className="playing-table"
          key={`playing-table-item-${index}}`}>
          <div>{index + 1}</div>
          <div>{south}</div>
          <div>{west}</div>
          <div>{north}</div>
          <div>{east}</div>
          <div>
            <Link className="btn-style-border" to={`/table/${key}`}>
                            View
            </Link>
          </div>
        </div>
      );
    });

    return (
      <div className="table-list">
        <h4>Live</h4>
        {!this.props.isLoad && (
          <div>
            <div className="table-list-item-group">loading... </div>
          </div>
        )}
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
