import React from "react";
import PropTypes from "prop-types";
import {Hand} from "./hand.js";
import {mapToFourHands} from "../examineCards.js";
import {DIRECTION} from "../constant.js";
import {RewindAuction} from "./rewindAuction.js";
import {RewindResult} from "./rewindResult.js";

export default class GameRewind extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (!this.props.record) {
      return null;
    }
    let {cards, bid} = this.props.record;
    let fourHandCards = mapToFourHands(cards);
    let fourHands = fourHandCards.map((cards, index) => (
      <Hand
        direction={DIRECTION[index]}
        key={`hand-${index}`}
        cards={cards}
        player={this.props.players[index]}
      />
    ));
    return (
      <div className="rewind">
        {fourHands}
        <RewindAuction players={this.props.players} bid={bid} />
        <RewindResult players={this.props.players} cards={cards} />
        <div />
      </div>
    );
  }
}
