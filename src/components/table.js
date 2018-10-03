import React from "react";
import Game from "./game.js";
import {getRandomInt, getObjSortKey, getRandomKey} from "../helper/helper.js";
import {dispatch, dispatchToDatabase} from "../reducer/reducer.js";
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

    return (
      <div>
        <Game
          currentUser={currentUser}
          tableId={targetTable.key}
          table={targetTable}
        />
      </div>
    );
  }
}
