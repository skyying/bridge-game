import React from "react";
import PropTypes from "prop-types";
import {GAME_STATE} from "./constant.js";
import JoinState from "./JoinState.js";
import AuctionState from "./AuctionState.js";
import PlayingState from "./PlayingState.js";
import GameoverState from "./GameoverState.js";

export default class GameState extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameState: this.props.table.gameState
    };
    this.stateComponents = this.stateComponents.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.table.gameState !== this.props.table.gameState) {
      this.setState({gameState: this.props.table.gameState});
    }
  }
  stateComponents(state) {
    switch (state) {
      case GAME_STATE.join: {
        return <JoinState {...this.props} />;
      }
      case GAME_STATE.auction: {
        return (
          <div>
            <AuctionState {...this.props} />;
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
    let {gameState} = this.state;
    let {isChatroomShown} = this.props;

    return (
      <div className={isChatroomShown ? "game" : "game full"}>
        {this.stateComponents(gameState)}
      </div>
    );
  }
}
