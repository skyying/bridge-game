import React from "react";
import Game from "./game.js";
import {getRandomInt, getRandomKey} from "../helper/helper.js";
export default class Table extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let tableId = this.props.match.params.id;
    return (
      <div>
        <Game
          currentUser={this.props.currentUser}
          tableId={tableId}
          table={this.props.tables[tableId]}
        />
      </div>
    );
  }
}
