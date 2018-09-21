import React from "react";
import PropTypes from "prop-types";
import {Heart, Spade, Diamond, Club} from "./shape/shape.js";
import {CARD_NUM, CARD_RANK} from "./constant.js";

const suits = {
  0: scale => <Club scale={scale} />,
  1: scale => <Diamond scale={scale} />,
  2: scale => <Heart scale={scale} />,
  3: scale => <Spade scale={scale} />
};

export const Card = ({value, isOpen}) => {
  let kind = Math.floor(value / CARD_NUM.HAND);
  if (value === CARD_NUM.HAND) return null;
  return (
    <div>
      {CARD_RANK[value % CARD_NUM.HAND]}
      {suits[kind](0.2)}
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
