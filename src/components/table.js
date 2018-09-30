import React from "react";
import Game from "./game.js";
import {getRandomInt, getRandomKey} from "../helper/helper.js";
import {dispatch, dispatchToDatabase} from "../reducer/reducer.js";
export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.createNewGame = this.createNewGame.bind(this);
  }
  createNewGame() {
    let tableId = this.props.match.params.id;
    // append a new game to databse
    // dispatchToDatabase("CREATE_NEW_GAME", {
    //   tableId: tableId,
    //   table: this.props.tables[tableId]
    // });
  }
  render() {
    let tableId = this.props.match.params.id;
    return (
      <div>
        <Game
          createNewGame={this.createNewGame}
          currentUser={this.props.currentUser}
          tableId={tableId}
          table={this.props.tables[tableId]}
        />
      </div>
    );
  }
}
