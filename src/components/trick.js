import React from "react";
import PropTypes from "prop-types";
import {getRandomKey} from "../helper/helper.js";
import {Card} from "./card.js";

export default class Trick extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log("COMP: TRICK");
    if (this.props.cardsByPlayer) {
      let cards = this.props.cards;
      this.maxTrick = Math.max(...cards.map(card => card.trick));
    }
    // error handling
    if (!this.maxTrick) {
      return null;
    }

    // sorting tricks by player index, filter tricks by max tricks
    let currentTrick = this.props.cardsByPlayer.map((hand, index) => {
      hand = hand.sort((cardA, cardB) => cardA.value - cardB.value);
      let trickCards = hand.map(userHand => {
        if (userHand.trick === this.maxTrick) {
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

    return (
      <div>
        <h2>Current Trick</h2>
        {currentTrick}
      </div>
    );
  }
}
