import React from "react";
import PropTypes from "prop-types";
import {Heart, Spade, Diamond, Club} from "./shape/shape.js";
import {CARD_NUM, CARD_RANK, SUIT_SHAPE} from "./constant.js";
import "../style/reset.scss";
import "../style/card.scss";

export const Card = ({value, isOpen, isFront = true}) => {
  let kind = Math.floor(value / CARD_NUM.HAND);
  if (isFront) {
    return (
      <div className="card flip-up">
        <div className="card-inner">
          <div>{value}</div>
          <div
            className={
              kind === 1 || kind === 2
                ? "red value"
                : "black value"
            }>
            {CARD_RANK[value % CARD_NUM.HAND]}
          </div>
          {SUIT_SHAPE[kind](0.24)}
        </div>
      </div>
    );
  } else {
    return <div className="card flip-down" />;
  }
};

export const CardWithClickEvt = ({value, isOpen, isFront, evt, name}) => {
  return (
    <div className={`card-wrapper ${name}`} onClick={() => evt(value)}>
      <Card value={value} isOpen={isOpen} />
    </div>
  );
};
