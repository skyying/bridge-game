import React from "react";
import {AuctionResult} from "../auction/auctionResult.js";
import {GAME_STATE} from "../constant";
import GameResult from "../gameResult";


export default function PlayingInfo({
                         isSidebarPanelShown,
                         currentUser,
                         windowWidth,
                         windowHeight,
                         table,
                         hands,
                         cardsByPlayer,
                         isTrickFinish
                     }) {

    let canSwitchToSmallerPanel =
        (isSidebarPanelShown &&
            windowWidth <= 1300) ||
        windowWidth <= 1000;

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
            <GameResult currentUser={currentUser} table={table}/>
        </div>
    );
}


