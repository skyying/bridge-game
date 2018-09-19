import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {getRandomKey} from "../helper/helper.js";
import {dispatch} from "../reducer/reducer.js";

export default class TableList extends React.Component {
  constructor(props) {
    super(props);
    this.addPlayerToTable = this.addPlayerToTable.bind(this);
  }
  addPlayerToTable(id) {
    console.log("addPlayerToTable");
    console.log(id);
    dispatch("ADD_USER_TO_TABLE", {id: id});
  }
  render() {
    console.log("COMP, TABLE_LIST");
    if (!this.props.tables) {
      return <div>no available</div>;
    }
    let tablesLink = this.props.tables.map((table, index) => {
      console.log("xxxxxxxxxx");
      console.log(this.props.tables.length);
      return (
        <Link
          key={getRandomKey()}
          onClick={() => this.addPlayerToTable(index)}
          to={`/table/${index}`}>
                    第 {index} 桌
        </Link>
      );
    });

    return <div>{tablesLink}</div>;
  }
}
