import React from "react";
import PropTypes from "prop-types";
import {CARD_RANK, SUIT_SHAPE, TOTAL_TRICKS} from "./constant.js";
import "../style/reset.scss";
import "../style/card.scss";

/*
 * value: 0 - 51, poker card facevalue
 */
export const TrickCard = ({value}) => {
  return (
    <div>
      <Card flipUp={true} value={value} />
    </div>
  );
};

TrickCard.propTypes = {
  value: PropTypes.number
};

/*
 * value: 0 - 51, poker card facevalue
 * evt: a click event
 * flipUp: should flip a card up or down
 * name: class name for style
 */
export const Card = ({value, evt = null, flipUp, name = null}) => {
  let kind = Math.floor(value / TOTAL_TRICKS);
  let wrapName = name ? `card-wrapper ${name}` : "card-wrapper";
  return (
    <CardContainer value={value} evt={evt} flipUp={flipUp} name={wrapName}>
      <div
        className={
          kind === 1 || kind === 2 ? "red value" : "black value"
        }>
        {CARD_RANK[value % TOTAL_TRICKS]}
        {SUIT_SHAPE[kind](0.235)}
      </div>
      <LargeShape kind={kind} />
    </CardContainer>
  );
};

Card.propTypes = {
  value: PropTypes.number,
  evt: PropTypes.func,
  flipUp: PropTypes.bool,
  name: PropTypes.string
};

const CardContainer = ({name, flipUp, evt, value, children}) => {
  const clickEvt = () => {
    if (evt) {
      evt(value);
    }
  };
  return (
    <div onClick={clickEvt} className={name}>
      <div className={flipUp ? "card flip-up" : "card flip-down"}>
        <div className="card-inner">{flipUp ? children : null}</div>
      </div>
    </div>
  );
};

CardContainer.propTypes = {
  children: PropTypes.array,
  value: PropTypes.number,
  evt: PropTypes.func,
  flipUp: PropTypes.bool,
  name: PropTypes.string
};

/*
 * kind: 0-3, which suit, 0: club, 1: diamond, 2: heart, 3: spade
 */
const LargeShape = ({kind}) => {
  return <div className="large-shape">{SUIT_SHAPE[kind](0.5)}</div>;
};

LargeShape.propTypes = {
  kind: PropTypes.number
};


