import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

export class TrickScore extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log("COMP: TRICK_SCORE");
    let game = this.props.game;
    if (!game || !game.cards) {
      return null;
    }
    let scoreTeamOne = 0,
      scoreTeamTwo = 0;

    // which team players belong: [ one, two, one ,two]
    game.cards.map((card, index) => {
      let winningScore = card.isWin ? 1 : 0;
      if ((index % 4) % 2 === 0) {
        scoreTeamOne += winningScore;
      } else {
        scoreTeamTwo += winningScore;
      }
    });
    let [player1, player2, player3, player4] = game.players;
    return (
      <div>
        {player1} {player3} : {scoreTeamOne} v.s
        {player2} {player4}:{scoreTeamTwo}
      </div>
    );
  }
}
