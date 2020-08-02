import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {AuctionResult} from "../auction/auctionResult.js";
import {GAME_STATE} from "../constant";
import GameResult from "../gameResult";

export default class PlayingInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let {
      isSidebarPanelShown,
      currentUser,
      windowWidth,
      windowHeight,
      table,
      hands,
      cardsByPlayer,
      isTrickFinish
    } = this.props;

    let canSwitchToSmallerPanel =
            (this.props.isSidebarPanelShown &&
                this.props.windowWidth <= 1300) ||
            this.props.windowWidth <= 1000;

    if (table.gameState === GAME_STATE.auction) {
      return null;
    }

    return (
      <div>
        <AuctionResult
          canSwitchToSmallerPanel={canSwitchToSmallerPanel}
          isSidebarPanelShown={isSidebarPanelShown}
          currentUser={currentUser}
          windowWidth={windowWidth}
          windowHeight={windowHeight}
          table={table}
        />
        <GameResult currentUser={currentUser} table={table} />
      </div>
    );
  }
}
