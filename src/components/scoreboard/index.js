import React from "react";
import PropTypes from "prop-types";
import GameResult from "../gameResult";
import {dispatchToDatabase} from "../../reducer";
import TeamScore from "../../logic/teamscore.js";
import "../../style/btn.scss";

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
    let {table, currentUser} = this.props;
    if (!table || !table.game.cards) {
      return null;
    }

    let score = new TeamScore(table, currentUser);

    let resultAction = score.isCurrentUserAPlayer ? (
      <button onClick={this.recordGame} className="btn">
                再來一局
      </button>
    ) : (
      "比賽結束"
    );

    return (
      <div
        className={
          score.result.isUserWin
            ? "game-over-board win"
            : "game-over-board lose"
        }>
        <TrickScore
          currentUser={this.props.currentUser}
          ratio={0.5}
          thumbnailSize={46}
          windowWidth={this.props.windowWidth}
          widnowHeight={this.props.windowHeight}
          table={this.props.table}>
          <div className="game-over-board-inner">
            <div className="result">
              <div className="words">
                {score.result.resultWords}
              </div>
            </div>
            <div className="btn-wrapper">{resultAction}</div>
          </div>
        </TrickScore>
      </div>
    );
  }
}
