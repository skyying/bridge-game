import React from "react";
import PropTypes from "prop-types";
import {Heart, Spade, Diamond, Club} from "./shape/heart.js";

const faceValue = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];

const suits = {
  0: scale => <Club scale={scale} />,
  1: scale => <Diamond scale={scale} />,
  2: scale => <Heart scale={scale} />,
  3: scale => <Spade scale={scale} />
};

export const Card = ({value, isOpen}) => {
  let kind = Math.floor(value / 13);
  if (value === 13) return null;
  return (
    <div>
      {faceValue[value % 13]}
      {suits[kind](0.2)}
    </div>
  );
};
