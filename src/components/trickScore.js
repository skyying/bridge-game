import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "../style/trickscore.scss";

export class TrickScore extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      seq: []
    }
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
      <div className="trick-score">
        <div className="trick-score-inner">
          <div className="group">
            <div className="thumbnail-group">
              <div className="thumbnail">
                <span>{player1[0]}</span>
              </div>
              <div className="thumbnail">
                <span>{player3[0]}</span>
              </div>
            </div>
            <div className="score">{scoreTeamOne}</div>
          </div>
          <div className="group">
            <div className="thumbnail-group">
              <div className="thumbnail">
                <span>{player2[0]}</span>
              </div>
              <div className="thumbnail">
                <span>{player4[0]}</span>
              </div>
            </div>
            <div className="score">{scoreTeamTwo}</div>
          </div>
        </div>
      </div>
    );
  }
}
