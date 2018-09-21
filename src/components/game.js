import React from "react";
import PropTypes from "prop-types";
import {getRandomInt, getRandomKey} from "../helper/helper.js";
import {dispatch} from "../reducer/reducer.js";
import {Card, CardWithClickEvt} from "./card.js";
import Trick from "./trick.js";
import {CARD_NUM, EMPTY_SEAT} from "./constant.js";
import {TrickScore} from "./trickScore.js";

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.shuffle = this.shuffle.bind(this);
    this.deal = this.deal.bind(this);
    this.getMaxTrick = this.getMaxTrick.bind(this);
    this.suffleCardsWhenReady = this.suffleCardsWhenReady.bind(this);
    // when player is ready, shuffle cards
    this.suffleCardsWhenReady();
  }
  suffleCardsWhenReady() {
    // when seats is full and has no cards on databse
    let table = this.props.table;
    if (table) {
      let curentGame = table.slice(0).pop();
      let isFourSeatsFull = curentGame.players.every(
        seat => seat !== EMPTY_SEAT,
      );
      if (!curentGame.cards && isFourSeatsFull) {
        this.shuffle();
      }
    }
  }
  getMaxTrick(cards) {
    return Math.max(...cards.map(card => card.trick));
  }
  deal(value) {
    console.log("-----------");
    console.log(value);
    if (!this.props.table) {
      return;
    }

    let game = this.props.table.slice(0).pop();
    let maxTrick = this.getMaxTrick(game.cards);

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
    if (cards && cards.length === CARD_NUM.TOTAL) {
      cardsByPlayer = players.map((userIndex, index) => {
        return cards.filter((card, i) => i % players.length === index);
      });

      // shift current user's index to zero, so their cards will
      // shown on bottom

      let currentUserIndex = players.findIndex(
        user => user === this.props.user,
      );

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

      // create dom element by cards in user's hand
      hands = cardsByPlayer.map((hand, index) => {
        let player = playerIDByCurrentUser[index];

        hand = hand.sort((a, b) => a.value - b.value);

        let cardsInHand = hand.map(userHand => {
          // if card already in trick, don't show them in players hand
          if (userHand.trick === 0) {
            return (
              <CardWithClickEvt
                evt={this.deal}
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
    return (
      <div>
        <div>{domPlayers}</div>
        <div>
          <br />
        </div>
        <div>{hands}</div>
        <br />
        <TrickScore
          game={this.props.table[this.props.table.length - 1]}
        />
        <div />
        <Trick
          maxTrick={() => this.getMaxtrick()}
          cards={cards}
          cardsByPlayer={cardsByPlayer}
        />
      </div>
    );
  }
}
