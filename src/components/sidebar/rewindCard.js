import React from "react";
import PropTypes from "prop-types";
import {CARD_NUM, CARD_RANK, SUIT_SHAPE} from "./constant.js";

export const RewindCard = ({value}) => {
  let kind = Math.floor(value / CARD_NUM.HAND);
  return (
    <div className="rewind-card">
      <div className="rewind-card-inner">
        {CARD_RANK[value % CARD_NUM.HAND]}
        {SUIT_SHAPE[kind](0.15)}
      </div>
    </div>
  );
};
