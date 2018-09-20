import React from "react";
import PropTypes from "prop-types";
import {getRandomInt, getRandomKey} from "../helper/helper.js";
import {dispatch} from "../reducer/reducer.js";
import {Card, CardWithClickEvt} from "./card.js";
import Trick from "./trick.js";

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.shuffle = this.shuffle.bind(this);
    this.play = this.play.bind(this);
    this.getMaxTrick = this.getMaxTrick.bind(this);
    this.suffleCardsWhenReady = this.suffleCardsWhenReady.bind(this);
    // when player is ready, shuffle cards
    this.suffleCardsWhenReady();
  }
  suffleCardsWhenReady() {
    // when seats is full and has no cards on databse
    let table = this.props.table;
    let emptySeat = -1;
    if (table) {
      table.game = table.slice(0).pop();
      let isFourSeatsFull = table.game.players.every(
        player => player !== -1,
      );
      console.log("isFourSeatsFull", isFourSeatsFull);
      if (!table.game.cards && isFourSeatsFull) {
        this.shuffle();
      }
    }
  }

  getMaxTrick(cards) {
    return Math.max(...cards.map(card => card.trick));
  }
  play(value) {
    if (!this.props.table) {
      return;
    }
    let game = this.props.table.slice(0).pop();
    let maxTrick = this.getMaxTrick(game.cards);
    // if all cards that has maxtricks didn't exceed 4, set maxtrick,
    console.log("this.props.tableId", this.props.tableId);
    dispatch("UPDATE_CURRENT_TRICK", {
      value: value,
      maxTrick: maxTrick,
      id: this.props.tableId
    });
  }
  shuffle() {
    let bid = [1, 2];

    let CARD_NUM = 52;

    // create array from 0 - 51
    let cards = Array.from({length: CARD_NUM})
      .fill(0)
      .map((card, i) => i);

    // shuffle array algorithm
    for (let i = cards.length - 1; i > 0; i--) {
      let randomIndex = getRandomInt(0, CARD_NUM - 1);
      [cards[i], cards[randomIndex]] = [cards[randomIndex], cards[i]];
    }

    // get new cards
    cards = cards.map(card => ({
      value: card,
      trick: 0
    }));

    // todo bid
    dispatch("ADD_NEW_DECK_TO_TABLE", {
      id: this.props.tableId,
      cards: cards,
      bid: bid
    });
  }

  render() {
    console.log("COMP: Game");
    let table = this.props.table;
    let game = table.slice(0).pop();
    let cards = game.cards;
    let players = game.players;

    let direction = ["south", "west", "north", "east"];
    let domPlayers = [],
      cardsByPlayer,
      playerIDByCurrentUser,
      hands;

    if (players) {
      for (let key in players) {
        domPlayers.push(
          <div key={getRandomKey()}> {players[key]} </div>,
        );
      }
    }

    // turn cards to 4 hands
    console.log("cards", cards);
    if (cards && cards.length === 52) {
      cardsByPlayer = players.map((userIndex, index) => {
        return cards.filter((card, i) => i % players.length === index);
      });

      // shift current user's index to zero, so their cards will
      // shown on bottom

      let currentUserIndex = players.findIndex(
        user => user === this.props.user,
      );

      console.log("currentUserIndex", currentUserIndex);
      // if current user is a player, shift card
      if (!(currentUserIndex < 0)) {
        cardsByPlayer = [
          ...cardsByPlayer.slice(currentUserIndex),
          ...cardsByPlayer.slice(0, currentUserIndex)
        ];
        playerIDByCurrentUser = [
          ...players.slice(currentUserIndex),
          ...players.slice(0, currentUserIndex)
        ];
      }

      console.log("------should have value---");
      console.log("cardsByPlayer", cardsByPlayer);
      // create dom element by cards in user's hand
      hands = cardsByPlayer.map((hand, index) => {
        console.log("index", index);
        let player = playerIDByCurrentUser[index];

        console.log("hand", hand);
        hand = hand.sort((a, b) => a.value - b.value);

        let cardsInHand = hand.map(userHand => {
          // if card already in trick, don't show them in players hand
          console.log("userHand", userHand);
          if (userHand.trick === 0) {
            return (
              <CardWithClickEvt
                evt={this.play}
                isOpen={true}
                key={getRandomKey()}
                value={userHand.value}
              />
            );
          }
        });

        return (
          <div className={direction[index]} key={getRandomKey()}>
            <br />
            <div>{player}</div>
            <div>{cardsInHand}</div>
          </div>
        );
      });
    } // end of cards
    console.log("cards", cards);
    return (
      <div>
        <div>{domPlayers}</div>
        <div>
          <br />
        </div>
        <div>{hands}</div>
        <br />
        <Trick
          maxTrick={() => this.getMaxtrick()}
          cards={cards}
          cardsByPlayer={cardsByPlayer}
        />
      </div>
    );
  }
}
