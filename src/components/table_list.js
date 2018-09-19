import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { getRandomKey } from "../helper/helper.js";
import { dispatch } from "../reducer/reducer.js";

export default class TableList extends React.Component {
  constructor(props) {
    super(props);
    this.addPlayerToTable = this.addPlayerToTable.bind(this);
  }
  addPlayerToTable(id) {
    console.log("addPlayerToTable");
    console.log(id);
    dispatch("ADD_USER_TO_TABLE", { id: id });
  }
  render() {
    console.log("COMP, TABLE_LIST");
    if (!this.props.tables) {
      return <div>no available</div>;
    }
    let tables = this.props.tables;
    let tableList = [];
    for (let table in tables) {
      tableList.push(table);
    }
    let tablesLink = tableList.map((table, index) => {
      return (
        <Link
          key={getRandomKey()}
          onClick={() => this.addPlayerToTable(table)}
          to={`/table/${table}`}
        >
                    第 {table} 桌
        </Link>
      );
    });

    return <div>{tablesLink}</div>;
  }
}
