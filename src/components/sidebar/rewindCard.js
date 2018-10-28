import React from "react";
import PropTypes from "prop-types";
import {CARD_NUM, CARD_RANK, SUIT_SHAPE, TOTAL_TRICKS} from "./constant.js";

export const RewindCard = ({value}) => {
  let kind = Math.floor(value / TOTAL_TRICKS);
  return (
    <div className="rewind-card">
      <div className="rewind-card-inner">
        {CARD_RANK[value % TOTAL_TRICKS]}
        {SUIT_SHAPE[kind](0.15)}
      </div>
    </div>
  );
};
