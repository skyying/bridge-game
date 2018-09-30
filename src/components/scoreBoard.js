import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import TrickScore from "./trickScore.js";
import {dispatchToDatabase} from "../reducer/reducer.js";
import "../style/btn.scss";

export default class ScoreBoard extends React.Component {
  constructor(props) {
    super(props);
    this.setReadyState = this.setReadyState.bind(this);
  }
  setReadyState() {
    let {currentUser, game, tableId, gameIndex} = this.props;
    let ready = this.props.game.ready;

    //  find current user index
    let playerIndex = game.players.findIndex(
      player => player === currentUser,
    );

    // see if others still not ready
    let isAllReady =
            ready.filter(
              (player, index) => player === false && index !== playerIndex,
            ).length === 0;

    if (playerIndex >= 0) {
      dispatchToDatabase("READY_A_PLAYER", {
        player: playerIndex,
        tableId: tableId,
        game: game,
        value: true,
        gameIndex: gameIndex
      });
    }
  }
  render() {
    let {game, windowWidth, windowHeight, currentUser} = this.props;
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

    let result = {
      win: "Congrets! You Win",
      lose: "Try again ?"
    };
    let resultWords = null;
    let playerIndex = game.players.indexOf(currentUser);
    if (playerIndex >= 0) {
      if (playerIndex % 2 === 0 && scoreTeamOne > scoreTeamTwo) {
        resultWords = result.win;
      } else {
        resultWords = result.lose;
      }
    } else {
      resultWords = "";
    }

    return (
      <div className="game-over-board">
        <TrickScore
          currentUser={this.props.currentUser}
          ratio={0.5}
          thumbnailSize={46}
          windowWidth={this.props.windowWidth}
          widnowHeight={this.props.windowHeight}
          game={this.props.game}>
          <div className="result">
            <div className="words">{resultWords}</div>
            <div>
              <button
                onClick={this.setReadyState}
                className="btn">
                                Play again
              </button>
            </div>
          </div>
        </TrickScore>
      </div>
    );
  }
}
