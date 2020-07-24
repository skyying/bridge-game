import React from "react";
import {AuctionResult} from "../auction/auctionResult.js";
import {GAME_STATE} from "../constant";
import GameResult from "../gameResult";
import {calcShouldSwitchOrNot} from "./helper/helper.ts";


export default function PlayingInfo({
                                        isSidebarPanelShown,
                                        currentUser,
                                        windowWidth,
                                        windowHeight,
                                        table,
                                    }) {

    // TODO should extract this out
    const canSwitchToSmallerPanel = calcShouldSwitchOrNot(isSidebarPanelShown, windowWidth);

    // auction state dont have need to display playing information
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


