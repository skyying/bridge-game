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

export default class TableList extends React.Component {
  constructor(props) {
    super(props);
    this.addPlayerToTable = this.addPlayerToTable.bind(this);
    this.createTable = this.createTable.bind(this);
  }
  componentDidMount() {
    // should refactor this, write a promise for timeOut;
    setTimeout(() => {
      if (!this.props.tables) {
        this.createTable();
      }
    }, 1500);
  }
  createTable(tableRef) {
    let tableNum;
    if (this.props.tables) {
      tableNum = Object.keys(this.props.tables).length;
    } else {
      tableNum = 0;
    }
    dispatchToDatabase("CREATE_TABLE", {
      tableNum: tableNum,
      tableRef: tableRef,
      currentUser: this.props.currentUser
    });
  }
  addPlayerToTable(tableId) {
    let tables = this.props.tables;
    if (!tables) return;
    dispatchToDatabase("ADD_PLAYER_TO_TABLE", {
      table: tables[tableId],
      tableId: tableId,
      currentUser: this.props.currentUser
    });
  }
  render() {
    let {tables} = this.props;
    let keys = getObjSortKey(tables);
    if (!tables || !keys) {
      return <div>loading table data...</div>;
    }
    let tablesLink = keys.map((key, index) => {
      let linkId = tables[key]["linkId"];
      return (
        <Link
          key={getRandomKey()}
          onClick={() => this.addPlayerToTable(key)}
          to={`/table/${linkId}`}>
                    第 {index} 桌
        </Link>
      );
    });

    // as a ref of tableId
    let tableRef = new Date().getTime();

    return (
      <div>
        <Link
          onClick={() => this.createTable(tableRef)}
          to={`/table/${tableRef}`}>
                    create table
        </Link>
        {tablesLink}
      </div>
    );
  }
}
