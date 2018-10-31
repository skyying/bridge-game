import React from "react";
import PropTypes from "prop-types";
import ScoreBoard from "./scoreboard";

export default class GameoverState extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let {
      currentUser,
      isSidebarPanelShown,
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
