import React from "react";
import PropTypes from "prop-types";
import {GAME_STATE} from "./constant";
import JoinState from "./joinState.js";
import AuctionState from "./auction";
import PlayingState from "./playingState.js";
import GameoverState from "./gameoverState.js";

/*
 * game state of current table, there are 5 state in a game
 *
 * Join: a table is created, owner of that table is joined and waiting for other players
 * once all seats are full, game will enter to next state.
 *
 * Auction: four players are ready, and start the auction phase, each player will call
 * their bid by turn. when a contract is made, will enter playing state
 *
 * Playing: players start to play.
 *
 * gameover: all 52 cards have been played and display play results to players
 * close: a table has no any player continue to play, table with close state will be
 * recycle
 */
export default class GameState extends React.Component {
  constructor(props) {
    super(props);
    this.stateComponents = this.stateComponents.bind(this);
  }
  stateComponents(state) {
    switch (state) {
      case GAME_STATE.join: {
        return <JoinState {...this.props} />;
      }
      case GAME_STATE.auction: {
        return (
          <div>
            <AuctionState {...this.props} />
            <PlayingState isFinishAuction={false} {...this.props} />
          </div>
        );
      }
      case GAME_STATE.playing: {
        return <PlayingState isFinishAuction={true} {...this.props} />;
      }
      case GAME_STATE.gameover: {
        return <GameoverState {...this.props} />;
      }
      default:
        return null;
    }
  }
  render() {
    let {gameState} = this.props.table;
    let {isSidebarPanelShown} = this.props;
    return (
      <div className={isSidebarPanelShown ? "game" : "game full"}>
        {this.stateComponents(gameState)}
      </div>
    );
  }
}

GameState.propTypes = {
  table: PropTypes.object,
  isSidebarPanelShown: PropTypes.bool,
  windowWidth: PropTypes.number,
  windowHeight: PropTypes.number,
  sidebarWidth: PropTypes.number,
  sidebarRef: PropTypes.object,
  currentUser: PropTypes.object,
  currentTableId: PropTypes.any
};
