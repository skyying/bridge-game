import React from "react";
import PropTypes from "prop-types";
import {getRandomInt, getRandomKey} from "../helper/helper.js";
import {dispatch} from "../reducer/reducer.js";

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.shuffle = this.shuffle.bind(this);
    this.shuffle();
  }
  shuffle() {
    let CARD_NUM = 52;
    let cards = Array.from({length: CARD_NUM})
      .fill(0)
      .map((card, i) => i);

    for (let i = cards.length - 1; i > 0; i--) {
      let randomIndex = getRandomInt(0, 51);
      [cards[i], cards[randomIndex]] = [cards[randomIndex], cards[i]];
    }
    cards = cards.map((card, index) => ({
      card: card,
      playerIndex: index % 4,
      trick: 0
    }));
    console.log("cards", cards);
    dispatch("ADD_NEW_DECK_TO_TABLE", {
      id: this.props.tableId,
      cards: cards,
      isStart: true
    });
  }
  // mapCard(index){

  // }
  render() {
    console.log("COMP: Game");
    console.log(this.props);
    let table = this.props.table;
    let cards = table.cards;
    let players = table.players;
    let domPlayers = [];

    if (players) {
      for (let key in players) {
        domPlayers.push(
          <div key={getRandomKey()}> {players[key]} </div>,
        );
      }
    }
    let cardByUser = [0, 1, 2, 3].map((userIndex, index) => {
      return cards.filter(card => card.playerIndex === userIndex);
    });
    console.log("cardByUser", cardByUser);
    return (
      <div>
        <div>{domPlayers}</div>
      </div>
    );
  }
}
