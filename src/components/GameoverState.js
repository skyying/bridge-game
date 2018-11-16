import React from "react";
import PropTypes from "prop-types";
import GameResult from "./gameResult";
import {dispatchToDatabase} from "../reducer";
import TeamScore from "../logic/teamscore.js";
import "../style/btn.scss";

/*
 * save current game data to database and create a new game
 * @param table, object, data for curent table, includes players and game records
 * return void
 */
const saveAndStartNewGame = table => {
  const TOTAL_CARDS_NUM = 52;
  if (!table || table.game.order < TOTAL_CARDS_NUM) {
    dispatchToDatabase("CREATE_NEW_GAME", {
      table: table
    });
  }
};

/*
 * Decide next step for current login player or viewer
 * @param isAllowNextStep, boolean, true for current player, false for viewer
 * return react element
 */
const nextStep = (isAllowNextStep, table) => {
  return isAllowNextStep ? (
    <button onClick={() => saveAndStartNewGame(table)} className="btn">
            Play again
    </button>
  ) : (
    "Game over"
  );
};

/*
 * Show team score when current game is over, show team score base on login user role, and
 * their play result
 * @param currentUser, object, current login user
 * @param windowWidth, number, current screen width
 * @param windowHeight, number, current screen height
 * @param table, object, current table data
 * @param gameStyleName, string, class name for dom element
 * return react element
 */

const GameoverState = ({currentUser, table, gameStyleName}) => {
  if (!table || !table.game.cards) {
    return null;
  }

  // get team score and game result base on table info
  let score = new TeamScore(table, currentUser);

  return (
    <div className={gameStyleName}>
      <div
        className={
          score.result.isUserWin && score.isCurrentUserAPlayer 
            ? "game-over-board win"
            : "game-over-board lose"
        }>
        <GameResult currentUser={currentUser} table={table}>
          <div className="game-over-board-inner">
            <div className="result">
              <div className="words">
                {score.isCurrentUserAPlayer &&
                                    score.result.resultWords}
              </div>
            </div>
            <div className="btn-wrapper">
              {nextStep(score.isCurrentUserAPlayer, table)}
            </div>
          </div>
        </GameResult>
      </div>
    </div>
  );
};

GameoverState.propTypes = {
  currentUser: PropTypes.object,
  windowWidth: PropTypes.number,
  windowHeight: PropTypes.number,
  table: PropTypes.object,
  gameStyleName: PropTypes.string
};

export default GameoverState;
