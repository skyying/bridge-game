import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {getRandomKey} from "../helper/helper.js";
import {SUIT_SHAPE} from "./constant.js";
import {Thumbnail, ThumbnailWithTag} from "./thumbnail.js";
import {AuctionList} from "./auctionList.js";
import "../style/auction.scss";

export const AuctionResult = ({
  table,
  windowWidth,
  currentUser,
  windowHeight,
  isChatroomShown
}) => {
  let {game, playerInfo, players} = table;
  if (!game || !game.bid.result) {
    return null;
  }
  let playerThumbnails = players.map((player, index) => {
    if (currentUser.uid === player) {
      return (
        <ThumbnailWithTag
          key={`resultThumbnail-${index}`}
          name={playerInfo[player].displayName}
          size={30}
          isCurrentUser={true}
          offset={5}
        />
      );
    } else {
      return (
        <Thumbnail
          key={`resultThumbnail-${index}`}
          name={playerInfo[player].displayName}
          size={30}
          offset={5}
        />
      );
    }
  });

  let largeScreenWidth = 1300, smallerScreenWidth = 1000;
  let canSwitchToSmallerResult = isChatroomShown && windowWidth <= largeScreenWidth || windowWidth <= smallerScreenWidth;

  let declarer = playerInfo[players[game.bid.declarer]];

  if (canSwitchToSmallerResult) {
    return (
      <div
        className="auction-result"
        style={{
          top: 20,
          right: Math.ceil(windowWidth / 500) * 5
        }}>
        <div className="auction-result-inner result-small">
          <div className="auction-result-small">
            <span>
              <Thumbnail
                name={declarer.displayName}
                size={20}
                offset={0}
              />
            </span>
            <span> {game.bid.trick + 1} </span>{" "}
            {SUIT_SHAPE[game.bid.trump](0.14)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="auction-result"
      style={{
        top: 20,
        right: Math.ceil(windowWidth / 500) * 5
      }}>
      <div className="auction-result-inner">
        <div className="thumbnail-group">{playerThumbnails}</div>
        <AuctionList scale={0.15} result={game.bid.result} />
      </div>
    </div>
  );
};
