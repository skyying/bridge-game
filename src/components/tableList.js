import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {getRandomKey} from "../helper/helper.js";
import {dispatch} from "../reducer/reducer.js";
import {EMPTY_SEAT} from "../components/constant.js";
import {getObj} from "../helper/helper.js";
import {app} from "../firebase/firebase.js";
import {dispatchToDatabase} from "../reducer/reducer.js";

export default class TableList extends React.Component {
  constructor(props) {
    super(props);
    this.addPlayerToTable = this.addPlayerToTable.bind(this);
    this.createTable = this.createTable.bind(this);
    if (!this.props.tables) {
      this.createTable();
    }
  }
  createTable() {
    let {tables} = this.props;
    let newTableId = tables ? tables.length : 0;
    dispatchToDatabase("CREATE_TABLE", {
      tableId: newTableId,
      currentUser: this.props.currentUser,
    });
  }
  addPlayerToTable(id) {
    let tables = this.props.tables;
    if (!tables) return;
    dispatchToDatabase("ADD_PLAYER_TO_TABLE", {
      table: tables[id],
      currentUser: this.props.currentUser,
      id: id
    });
  }
  render() {
    console.log("COMP, TABLE_LIST");
    let {tables} = this.props;
    if (!tables) {
      return <div>loading table data...</div>;
    }
    let tablesLink = tables.map((table, index) => {
      return (
        <Link
          key={getRandomKey()}
          onClick={() => this.addPlayerToTable(index)}
          to={`/table/${index}`}>
                    第 {index} 桌
        </Link>
      );
    });
    let lastIndex = tables.length;
    console.log("lastIndex", lastIndex);
    return (
      <div>
        <Link onClick={this.createTable} to={`/table/${lastIndex}`}>
                    create table
        </Link>
        {tablesLink}
      </div>
    );
  }
}
