import React from "react";
import PropTypes from "prop-types";
import {getRandomKey} from "../helper/helper.js";
import {Card} from "./card.js";

export default class Trick extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let {getMaxTrick, cards, cardsByPlayer} = this.props;
    if (!cards) {
      return null;
    }
    let currentTrick = null,
      maxTrick = getMaxTrick();
    let cardsMatchMaxTrick = cards.filter(card => card.trick === maxTrick)
      .length;

    // cause maxTrick will increase if there are already four cards
    if (cardsMatchMaxTrick === 0) {
      maxTrick -= 1;
    }

    // show cards sequence by player order
    if (this.props.cardsByPlayer) {
      // sorting tricks by player index, and filter cards by max trick
      currentTrick = this.props.cardsByPlayer.map((hand, index) => {
        hand = hand.sort((cardA, cardB) => cardA.value - cardB.value);
        let trickCards = hand.map(userHand => {
          if (userHand.trick === maxTrick) {
            return (
              <Card
                isOpen={true}
                key={getRandomKey()}
                value={userHand.value}
              />
            );
          }
        });
        return (
          <div key={getRandomKey()}>
            <div>{trickCards}</div>
          </div>
        );
      });
    }
    return (
      <div>
        <h2>Current Trick</h2>
        {currentTrick}
      </div>
    );
  }
}
