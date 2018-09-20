import React from "react";
import PropTypes from "prop-types";
import {Heart, Spade, Diamond, Club} from "./shape/shape.js";

const faceValue = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];

const suits = {
  0: scale => <Club scale={scale} />,
  1: scale => <Diamond scale={scale} />,
  2: scale => <Heart scale={scale} />,
  3: scale => <Spade scale={scale} />
};

let CARDS_PER_SUIT = 13;

export const Card = ({value, isOpen}) => {
  let kind = Math.floor(value / CARDS_PER_SUIT);
  if (value === CARDS_PER_SUIT) return null;
  return (
    <div>
      {faceValue[value % CARDS_PER_SUIT]}
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
