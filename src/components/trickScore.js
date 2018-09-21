import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

export class TrickScore extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let teamA, teamB;
    if (this.props.game) {
      [teamA, teamB] = this.props.game.result;
    }
    return (
      <div>
                teamA: {teamA} v.s teamB {teamB}
      </div>
    );
  }
}
