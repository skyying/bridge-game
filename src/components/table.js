import React from "react";
import Game from "./game.js";
import {getRandomInt, getObjSortKey, getRandomKey} from "../helper/helper.js";
import {Redirect} from "react-router-dom";
import {dispatch, dispatchToDatabase} from "../reducer/reducer.js";
import Sidebar from "./sidebar/sidebar.js";
import "../style/table.scss";
import "../style/sidebar.scss";
import "../style/record-item.scss";
import "../style/record.scss";
import "../style/dot.scss";

export default class Table extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let {tables, currentUser} = this.props;
    if (!tables) return;
    let linkId = this.props.match.params.id;
    let [targetTable] = Object.keys(tables)
      .map(key => {
        tables[key].key = key;
        return tables[key];
      })
      .filter(table => table.linkId === +linkId);
    if (targetTable.gameState === "close") {
      return <Redirect to="/lobby" />;
    }
    return (
      <div className="table">
        <Game
          currentUser={currentUser}
          tableId={targetTable.key}
          table={targetTable}
        />
        <Sidebar table={targetTable} />
      </div>
    );
  }
}
