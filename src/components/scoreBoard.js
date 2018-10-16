import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import TrickScore from "./trickScore.js";
import {dispatchToDatabase} from "../reducer/reducer.js";
import {RESULT} from "./constant.js";
import "../style/btn.scss";

export default class ScoreBoard extends React.Component {
  constructor(props) {
    super(props);
    this.recordGame = this.recordGame.bind(this);
  }
  recordGame() {
    let {table} = this.props;
    let {game} = table;
    if (!table || game.order !== 51) {
      return;
    }
    dispatchToDatabase("CREATE_NEW_GAME", {
      table: table
    });
  }
  render() {
    let {windowWidth, table, windowHeight, currentUser} = this.props;
    let {game, players} = this.props.table;
    if (!game || !game.cards) {
      return null;
    }
    let scoreTeamOne = 0,
      scoreTeamTwo = 0;
    let playerIndex = players.indexOf(currentUser.uid);
    let playerTeamScore = 0,
      opponentScore = 0;
    game.cards.map((card, index) => {
      let winScore = card.isWin ? 1 : 0;
      if (card.player % 2 === playerIndex % 2) {
        playerTeamScore += winScore;
      } else {
        opponentScore += winScore;
      }
    });

    let resultWords = null;
    let {declarer, trick} = game.bid;
    let targetTrick = 6 + trick;
    let isPlayerInDeclarerTeam = playerIndex % 2 === declarer % 2;

    if (isPlayerInDeclarerTeam && playerTeamScore >= targetTrick) {
      resultWords = RESULT.win;
    } else {
      resultWords = RESULT.lose;
    }

    return (
      <div className="game-over-board">
        <TrickScore
          currentUser={this.props.currentUser}
          ratio={0.5}
          thumbnailSize={46}
          windowWidth={this.props.windowWidth}
          widnowHeight={this.props.windowHeight}
          table={this.props.table}>
          <div>
            <div className="result">
              <div className="words">{resultWords}</div>
            </div>
            <div className="btn-wrapper">
              <button onClick={this.recordGame} className="btn">
                                Start a new Game
              </button>
            </div>
          </div>
        </TrickScore>
      </div>
    );
  }
}
