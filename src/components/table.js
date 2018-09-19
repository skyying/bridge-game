import React from "react";
import Game from "./game.js";

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.match.params.id);
  }
  render() {
    console.log("this is table comp");
    console.log(this.props);
    let id = this.props.match.params.id;
    return (
      <div>
        <div>
          <Game user={this.props.currentUser} tableId={id} table={this.props.tables[id]} />
        </div>
      </div>
    );
  }
}
