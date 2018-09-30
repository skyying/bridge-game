import React from "react";
import PropTypes from "prop-types";
import {getRandomKey} from "../helper/helper.js";
import {Card, TrickCard} from "./card.js";
import "../style/game.scss";

export default class Trick extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeOutCards: false
    };
  }
  componentDidUpdate(prevProps) {
    if (this.props.order !== prevProps.order) {
      if (this.props.order % 4 === 3) {
        setTimeout(() => this.setState({fadeOutCards: true}), 2000);
      } else {
        this.setState({fadeOutCards: false});
      }
    }
  }
  render() {
    console.log(this.props.order);
    console.log(this.state);
    let direction = ["south-card", "west-card", "north-card", "east-card"];
    let {
      order,
      cards,
      cardsByPlayer,
      isTrickFinish,
      currentMaxTrick
    } = this.props;
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
    if (cardsByPlayer && !this.state.fadeOutCards) {
      // sorting tricks by player index, and filter cards by max trick
      currentTrick = cardsByPlayer.map((hand, index) => {
        hand = hand.sort((cardA, cardB) => cardA.value - cardB.value);
        let trickCards = hand.map(userHand => {
          if (userHand.trick === maxTrick) {
            return (
              <TrickCard
                key={getRandomKey()}
                value={userHand.value}
              />
            );
          }
        });

        let hasTrickCards =
                    trickCards.filter(
                      card => card !== null && card !== undefined,
                    ).length > 0;
        if (hasTrickCards) {
          return (
            <div
              className={`trick-card-wrapper ${direction[index]}`}
              key={`trick-card-${index}`}>
              {trickCards}
            </div>
          );
        } else {
          return null;
        }
      });
    }

    if (currentTrick) {
      currentTrick = currentTrick.filter(
        card => card !== null && card !== undefined,
      );
    }

    return (
      <div className={"trick-area"}>
        <div className="trick-area-inner">{currentTrick}</div>
      </div>
    );
  }
}
