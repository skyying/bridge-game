import React from "react";
import PropTypes from "prop-types";
import {Heart, Spade, Diamond, Club} from "./shape/shape.js";
import {CARD_NUM, CARD_RANK, SUIT_SHAPE} from "./constant.js";
import "../style/reset.scss";
import "../style/card.scss";

export const CardFilpDown = ({name}) => {
  return (
    <div className={`card-wrapper ${name}`}>
      <div className="card flip-down">
        <div className="card-inner" />
      </div>
    </div>
  );
};

export const Card = ({value, evt = null, flipUp, name = null}) => {

  let kind = Math.floor(value / CARD_NUM.HAND);
  let wrapperName = name ? `card-wrapper ${name}` : "card-wrapper";

  if (flipUp) {
    return (
      <div
        className={wrapperName}
        onClick={() => {
          if (evt) {
            evt(value);
          }
        }}>
        <div className="card flip-up">
          <div className="card-inner">
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
      </div>
    );
  } else {
    return (
      <div className={wrapperName}>
        <div className="card flip-down">
          <div className="card-inner" />
        </div>
      </div>
    );
  }
};

export const CardWithClickEvt = ({value, evt, name}) => {
  return (
    <div className={`card-wrapper ${name}`} onClick={() => evt(value)}>
      <Card value={value} />
    </div>
  );
};
