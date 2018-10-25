import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {getRandomKey} from "../helper/helper.js";
import {Thumbnail, ThumbnailWithTag} from "./thumbnail.js";
import {AuctionList} from "./auctionList.js";
import "../style/auction.scss";

export const AuctionResult = ({
  table,
  windowWidth,
  currentUser,
  windowHeight
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
  return (
    <div
      className="auction-result"
      style={{
        top: Math.ceil(windowWidth / 500) * 5,
        right: Math.ceil(windowWidth / 500) * 5
      }}>
      <div className="auction-result-inner">
        <div className="thumbnail-group">{playerThumbnails}</div>
        <AuctionList scale={0.15} result={game.bid.result} />
      </div>
    </div>
  );
};
