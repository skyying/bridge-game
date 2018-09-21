import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {getRandomKey} from "../helper/helper.js";
import {dispatch} from "../reducer/reducer.js";
import {EMPTY_SEAT} from "../components/constant.js";
import {getObj} from "../helper/helper.js";
import {app} from "../firebase/firebase.js";

export default class TableList extends React.Component {
  constructor(props) {
    super(props);
    this.addPlayerToTable = this.addPlayerToTable.bind(this);
  }
  addPlayerToTable(id) {

    let tables = this.props.tables;
    if (!tables) return;

    let currentTable = tables[id].map(game => Object.assign({}, game));
    let currentGame = currentTable.pop();
    if (!currentGame.players) {
      currentGame.players = [
        EMPTY_SEAT,
        EMPTY_SEAT,
        EMPTY_SEAT,
        EMPTY_SEAT
      ];
    }
    let emptyIndex = currentGame.players.indexOf(EMPTY_SEAT);
    if (emptyIndex >= 0) {
      // if there are any empty seats, fill them first, else 
      // fill them by squence
      currentGame.players[emptyIndex] = this.props.currentUser.slice();
    }
    currentTable.push(currentGame);
    let currentTableObj = getObj(id, currentTable);

    // udpate player data to database
    app.updateTableDataByID(currentTableObj);
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
