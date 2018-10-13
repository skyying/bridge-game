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
    let tableKey = this.props.tableList[this.linkId].id;
    // only fetch data
    app.getNodeByPath(`tables/${tableKey}`, value => {
      return dispatch("UPDATE_TABLE_DATA", {
        table: value.val(),
        id: tableKey
      });
    });
    app.getNodeByPath(`chatroom/${tableKey}`, value => {
      return dispatch("UPDATE_CHAT_ROOM", {
        chatroom: value.val()
      });
    });
    this.addPlayerToTable = this.addPlayerToTable.bind(this);
  }
  componentDidMount() {
    this.linkId = this.props.match.params.id;
    let tableKey = this.props.tableList[this.linkId].id;

    console.log("comp did mount, table");
    // fetch data again
    app.getNodeByPath(`tables/${tableKey}`, value => {
      return dispatch("UPDATE_TABLE_DATA", {
        table: value.val(),
        id: tableKey
      });
    });
    app.getNodeByPath(`chatroom/${tableKey}`, value => {
      return dispatch("UPDATE_CHAT_ROOM", {
        chatroom: value.val()
      });
    });
  }
  componentWillUnmount() {
    console.log("will unmount");
    let tableKey = this.props.tableList[this.linkId].id;
    app.cancelListenDataChange(`tables/${tableKey}`);
  }
  addPlayerToTable(table) {
    if (!table) return;
    console.log("table -------- should have value", table);
    let {players} = table;
    let emptySeatIndex = players.findIndex(seat => seat === EMPTY_SEAT);
    let hasJoin = players.some(seat => seat === this.props.currentUser);
    if (emptySeatIndex > -1 && !hasJoin) {
      console.log("didn't join");
      dispatchToDatabase("ADD_PLAYER_TO_TABLE", {
        currentUser: this.props.currentUser,
        table: table,
        emptySeatIndex: emptySeatIndex
      });
    }
  }
  componentDidUpdate(prevProps) {
    console.log("in componentDidUpdate , comp table");
    let linkId = this.props.match.params.id;
    let tableKey = this.props.tableList[linkId].id;
    if (this.props.tables[tableKey] !== prevProps.tables[tableKey]) {
      console.log("current table is updated");
      this.addPlayerToTable(this.props.tables[tableKey]);
    }
  }
  render() {
    if (!Object.keys(this.props.tables).length) {
      return <div>loading</div>;
    }
    let {tables, currentUser} = this.props;
    let linkId = this.props.match.params.id;
    let tableKey = this.props.tableList[linkId].id;
    console.log("tables", tables);
    console.log("es[tableKey]", tables[tableKey]);
    if (!tables || !tables[tableKey]) {
      return null;
    }
    console.log("linkId", linkId);
    console.log("tableKey", tableKey);
    let targetTable = tables[tableKey];
    console.log("targetTable", targetTable);
    if (targetTable.gameState && targetTable.gameState === "close") {
      return <Redirect to="/lobby" />;
    }
    return (
      <div className="table">
        <Game currentUser={currentUser} table={targetTable} />
        <Sidebar
          currentUser={currentUser}
          chatroom={this.props.chatroom}
          table={targetTable}
        />
      </div>
    );
  }
}
