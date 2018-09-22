import React from "react";
import Game from "./game.js";
export default class Table extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let tableId = this.props.match.params.id;
    // console.log(this.props.currentUser);
    // console.log("this.props.currentUser");
    return (
      <div>
        <Game
          user={this.props.currentUser}
          tableId={tableId}
          table={this.props.tables[tableId]}
        />
      </div>
    );
  }
}
