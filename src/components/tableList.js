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
    this.createTable = this.createTable.bind(this);
  }
  createTable(tableRef) {
    dispatchToDatabase("CREATE_TABLE", {
      tableRef: tableRef,
      currentUser: this.props.currentUser
    });
  }
  render() {
    if (!this.props.tableList) {
      return <div>loading...</div>;
    }

    let tableLinks = Object.keys(this.props.tableList).map((key, index) => {
      return (
        <Link key={key} to={`/table/${key}`}>
                    第{index + 1}桌
        </Link>
      );
    });
    // onClick={() => this.addPlayerToTable(key)}
    let tableRef = new Date().getTime();
    return (
      <div>
        <Link
          onClick={() => this.createTable(tableRef)}
          to={`/table/${tableRef}`}>
                    create table
        </Link>
        {tableLinks}
      </div>
    );
  }
}
