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
    // error handling
    let maxTrick = this.props.maxTrick;
    if (!maxTrick || maxTrick === 0 || !this.props.cardsByPlayer) {
      return null;
    }
    let currentTrick = null;
    if (this.props.cardsByPlayer) {
      // sorting tricks by player index, filter tricks by max tricks
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
