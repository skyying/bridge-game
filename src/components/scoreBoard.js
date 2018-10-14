import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import TrickScore from "./trickScore.js";
import {dispatchToDatabase} from "../reducer/reducer.js";
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
      win: "當溫拿的感覺原來如此, 94 送",
      lose: "魯蛇的世界有點複雜，魯魯如我輸惹"
    };
    let resultWords = null;
    let playerIndex = players.indexOf(currentUser.uid);

    let {declarer, trick} = game.bid;
    let targetTrick = 6 + trick;
    let isDeclarerInTeamOne = declarer % 2 === 0;

    // if user is curretn user
    if (playerIndex >= 0) {
      // if user is declearer
      if (isDeclarerInTeamOne) {
        if (playerIndex % 2 === 0 && scoreTeamOne >= targetTrick) {
          resultWords = result.win;
        } else {
          resultWords = result.lose;
        }
      } else {
        if (playerIndex % 2 !== 0 && scoreTeamTwo >= targetTrick) {
          resultWords = result.win;
        } else {
          resultWords = result.lose;
        }
      }
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
