import React from "react";
import PropTypes from "prop-types";
import {Thumbnail} from "../thumbnail.js";
import {CARD_NUM, CARD_RANK, SUIT_SHAPE, TOTAL_TRICKS} from "../constant.js";

export const Hand = ({player, cards, direction}) => {
  let display = [[], [], [], []];
  cards.map(card =>
    display[Math.floor(card.value / TOTAL_TRICKS)].push(card)
  );
  let displaySuit = display.map((suit, index) => (
    <div className="hand" key={`suit-${index}`}>
      <div>{SUIT_SHAPE[index](0.15)}</div>
      <div className="card-value">
        {suit.map((card, index) => (
          <div key={`suit-${index}`}>
            {CARD_RANK[card.value % TOTAL_TRICKS]}
          </div>
        ))}
      </div>
    </div>
  ));
  return (
    <div className={`rewind-player ${direction}`}>
      <div>
        <Thumbnail name={player} size={26} />
      </div>
      <div className="hand-wrapper">{displaySuit}</div>
    </div>
  );
};
