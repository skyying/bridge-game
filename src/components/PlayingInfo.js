import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {AuctionResult} from "./auctionResult.js";
import {GAME_STATE} from "./constant.js";
import TrickScore from "./trickScore.js";

export default class PlayingInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let {
      isChatroomShown,
      currentUser,
      windowWidth,
      windowHeight,
      table,
      hands,
      cardsByPlayer,
      isTrickFinish
    } = this.props;

    let canSwitchToSmallerPanel =
            (this.props.isChatroomShown && this.props.windowWidth <= 1300) ||
            this.props.windowWidth <= 1000;

    
    if (table.gameState === GAME_STATE.auction) {
      return null;
    }
      
    return (
      <div>
        <AuctionResult
          canSwitchToSmallerPanel={canSwitchToSmallerPanel}
          isChatroomShown={isChatroomShown}
          currentUser={currentUser}
          windowWidth={windowWidth}
          windowHeight={windowHeight}
          table={table}
        />
        <TrickScore
          canSwitchToSmallerPanel={canSwitchToSmallerPanel}
          currentUser={currentUser}
          resizeRatio={0.15}
          innerStyle={{
            bottom: Math.ceil(this.props.windowWidth / 500) * 5,
            right: Math.ceil(this.props.windowWidth / 500) * 5
          }}
          thumbnailSize={30}
          name="right-bottom-pos"
          windowWidth={this.props.windowWidth}
          widnowHeight={this.props.windowHeight}
          table={this.props.table}
        />
      </div>
    );
  }
}
