import React from "react";
import PropTypes from "prop-types";
import {getRandomInt, getRandomKey} from "../helper/helper.js";
import {dispatch} from "../reducer/reducer.js";
import {Card} from "./card.js";

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.shuffle = this.shuffle.bind(this);
    let p = this.props;

    // timeing for shuffle card
    if (
      !p.table ||
            !p.table.isStart ||
            (p.table.player && p.player.length === 4)
    ) {
      this.shuffle();
    }
  }
  shuffle() {
    let CARD_NUM = 52;
    let cards = Array.from({length: CARD_NUM})
      .fill(0)
      .map((card, i) => i);

    for (let i = cards.length - 1; i > 0; i--) {
      let randomIndex = getRandomInt(0, CARD_NUM - 1);
      [cards[i], cards[randomIndex]] = [cards[randomIndex], cards[i]];
    }
    cards = cards.map((card, index) => ({
      value: card,
      trick: 0
    }));
    dispatch("ADD_NEW_DECK_TO_TABLE", {
      id: this.props.tableId,
      cards: cards,
      isStart: true
    });
  }
  render() {
    console.log("COMP: Game");
    let table = this.props.table;
    let cards = table.cards;
    let players = table.players;

    let direction = ["south", "west", "north", "east"];
    let domPlayers = [],
      cardByUser,
      playerByUser,
      hands;

    if (players) {
      for (let key in players) {
        domPlayers.push(
          <div key={getRandomKey()}> {players[key]} </div>,
        );
      }
    }
    if (cards && table.isStart) {
      cardByUser = players.map((userIndex, index) => {
        return cards.filter((card, i) => i % players.length === index);
      });

      // shift current user's index to zero, so their cards will
      // shown on bottom

      let currentUserIndex = players.findIndex(
        user => user === this.props.user,
      );

      // if current user is a player, shift card
      if (!(currentUserIndex < 0)) {
        cardByUser = [
          ...cardByUser.slice(currentUserIndex),
          ...cardByUser.slice(0, currentUserIndex)
        ];
        playerByUser = [
          ...players.slice(currentUserIndex),
          ...players.slice(0, currentUserIndex)
        ];
      }

      // create dom element by cards in user's hand
      hands = cardByUser.map((hand, index) => {
        let player = playerByUser[index];
        console.log("-----hand", hand);
        hand = hand.sort((a, b) => a.value - b.value);

        let cardsInHand = hand.map(userHand => (
          <Card
            isOpen={true}
            key={getRandomKey()}
            value={userHand.value}
          />
        ));
        return (
          <div className={direction[index]} key={getRandomKey()}>
            <br />
            <div>{player}</div>
            <div>{cardsInHand}</div>
          </div>
        );
      });
    }
    return (
      <div>
        <div>{domPlayers}</div>
        <div>
          <br />
        </div>
        <div>{hands}</div>
      </div>
    );
  }
}
