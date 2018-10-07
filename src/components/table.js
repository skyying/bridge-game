import React from "react";
import Game from "./game.js";
import {getRandomInt, getObjSortKey, getRandomKey} from "../helper/helper.js";
import {Redirect} from "react-router-dom";
import {dispatch, dispatchToDatabase} from "../reducer/reducer.js";
import Sidebar from "./sidebar/sidebar.js";
import {app} from "../firebase/firebase.js";
import {EMPTY_SEAT} from "./constant.js";
import "../style/table.scss";
import "../style/sidebar.scss";
import "../style/record-item.scss";
import "../style/record.scss";
import "../style/dot.scss";
import "../style/rewind.scss";

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.linkId = this.props.match.params.id;

    let tableKey = this.props.tableList[this.linkId];
    app.getNodeByPath(`tables/${tableKey}`, value => {
      return dispatch("UPDATE_TABLE_DATA", {table: value.val()});
    });
    this.addPlayerToTable = this.addPlayerToTable.bind(this);
  }
  addPlayerToTable(table) {
    let {players} = table;
    let emptySeatIndex = players.findIndex(seat => seat === EMPTY_SEAT);
    let hasJoin = players.some(seat => seat === this.props.currentUser);
    if (emptySeatIndex >= 0 && !hasJoin) {
      dispatchToDatabase("ADD_PLAYER_TO_TABLE", {
        currentUser: this.props.currentUser,
        id: table.id,
        emptySeatIndex: emptySeatIndex
      });
    }
  }
  componentDidUpdate(prevProps) {
    console.log("should udpate");
    let linkId = this.props.match.params.id;
    let tableKey = this.props.tableList[linkId];
    if (this.props.tables !== prevProps.tables) {
      this.addPlayerToTable(this.props.tables[tableKey]);
    }
  }
  render() {
    if (!Object.keys(this.props.tables).length) {
      return <div>loading</div>;
    }
    let {tables, currentUser} = this.props;
    if (!tables) return null;
    let linkId = this.props.match.params.id;
    let tableKey = this.props.tableList[linkId];
    let targetTable = this.props.tables[tableKey];
    if (targetTable.gameState === "close") {
      return <Redirect to="/lobby" />;
    }
    return (
      <div className="table">
        <Game
          currentUser={currentUser}
          table={targetTable}
        />
        <Sidebar table={targetTable} />
      </div>
    );
  }
}
