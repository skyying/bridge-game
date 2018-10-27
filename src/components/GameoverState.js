import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import ScoreBoard from "./scoreBoard.js";

export default class GameoverState extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let {
      currentUser,
      isChatroomShown,
      windowWidth,
      windowHeight,
      table,
      suffleCardsWhenReady,
      gameStyleName
    } = this.props;
    return (
      <div className={gameStyleName}>
        <ScoreBoard
          startGame={suffleCardsWhenReady}
          currentUser={currentUser}
          windowWidth={windowWidth}
          widnowHeight={windowHeight}
          table={table}
        />
      </div>
    );
  }
}
