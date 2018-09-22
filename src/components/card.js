import React from "react";
import PropTypes from "prop-types";
import {Heart, Spade, Diamond, Club} from "./shape/shape.js";
import {CARD_NUM, CARD_RANK, SUIT_SHAPE} from "./constant.js";

export const Card = ({value, isOpen}) => {
  let kind = Math.floor(value / CARD_NUM.HAND);
  return (
    <div>
      <h4>{value}</h4>
      {CARD_RANK[value % CARD_NUM.HAND]}
      {SUIT_SHAPE[kind](0.2)}
    </div>
  );
};

export const CardWithClickEvt = ({value, isOpen, evt}) => {
  return (
    <div onClick={() => evt(value)}>
      <Card value={value} isOpen={isOpen} />
    </div>
  );
};
