import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {Thumbnail} from "../thumbnail.js";
import {CARD_NUM, CARD_RANK, SUIT_SHAPE} from "../constant.js";

export const RewindAuction = ({players, bid}) => {
  let {declarer, trump, trick} = bid;
  return (
    <div className="rewind-auction">
      <h3>Auction</h3>
      <div>
        <Thumbnail name={players[declarer]} size={26} />
      </div>
      <div>
        {trick + 1} {SUIT_SHAPE[trump](0.15)}
      </div>
    </div>
  );
};




