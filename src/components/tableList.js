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
    if (!this.props.tables) {
      return <div>no available table</div>;
    }
    let tablesLink = this.props.tables.map((table, index) => {
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
