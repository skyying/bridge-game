import React from "react";
import PropTypes from "prop-types";
import {getRandomKey} from "../helper/helper.js";
import {Card} from "./card.js";
import "../style/game.scss";

export default class Trick extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let direction = ["south-card", "west-card", "north-card", "east-card"];
    let {cards, cardsByPlayer, currentMaxTrick} = this.props;
    if (!cards) {
      return null;
    }

    let currentTrick = null,
      maxTrick = currentMaxTrick();

    // cause maxTrick will increase if there are already four cards
    if (maxTrick === 0) {
      maxTrick = 1;
    }

    // show cards sequence by player order
    if (cardsByPlayer) {
      // sorting tricks by player index, and filter cards by max trick
      currentTrick = cardsByPlayer.map((hand, index) => {
        hand = hand.sort((cardA, cardB) => cardA.value - cardB.value);

        let trickCards = hand.map(userHand => {
          if (userHand.trick === maxTrick) {
            return (
              <Card
                flipUp={true}
                key={getRandomKey()}
                value={userHand.value}
              />
            );
          }
        });
        return (
          <div
            className={`trick-card-wrapper ${direction[index]}`}
            key={getRandomKey()}>
            {trickCards}
          </div>
        );
      });
    }
    // let trickStyle = {left: (window.innerWidth - 320) / 2, top:  }
    return (
      <div className="trick-area">
        <div className="trick-area-inner">{currentTrick}</div>
      </div>
    );
  }
}
