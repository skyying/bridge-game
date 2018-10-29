import React from "react";
import PropTypes from "prop-types";
import {Thumbnail} from "./thumbnail.js";

export const AuctionThumbnails = ({players, playerInfo, currentTurn}) => {
  const SIZE = 53;
  return players.map((player, index) => (
    <div
      key={`auction-thumbnail-${index}`}
      className={
        index === currentTurn
          ? "default-thumbnail current"
          : "default-thumbnail"
      }>
      <div className="default-thumbnail-inner">
        <div className="default-thumbnail-inner-outline-wrapper">
          <div className="default-thumbnail-inner-outline">
            <Thumbnail
              size={SIZE}
              current={index === currentTurn}
              name={playerInfo[player].displayName}
            />
          </div>
        </div>
        <span>{playerInfo[player].displayName}</span>
      </div>
    </div>
  ));
};
