import React from "react";
import PropTypes from "prop-types";
import {getRandomInt, getRandomKey} from "../helper/helper.js";
import {dispatch, dispatchToDatabase} from "../reducer/reducer.js";
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
    this.reset = this.reset.bind(this);
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
  getMaxTrick() {
    let table = this.props.table;
    if (!table) {
      return;
    }
    let cards = table[table.length - 1].cards,
      maxTrick = Math.max(...cards.map(card => card.trick)),
      maxTrickNum = cards.filter(card => card.trick === maxTrick).length;

    if (maxTrick === 0 || maxTrickNum >= 4) {
      return maxTrick + 1;
    }
    return maxTrick;
  }
  deal(value) {
    let table = this.props.table;
    if (!table) {
      return;
    }

    dispatchToDatabase("UPDATE_CURRENT_TRICK", {
      table: table,
      value: value,
      maxTrick: this.getMaxTrick(),
      id: this.props.tableId
    });
  }
  reset() {
    let tableId = this.props.tableId;
    dispatchToDatabase("RESET_GAME", {
      data: {cards: null, players: ["a", "b", "c", "d"]},
      id: tableId
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
    dispatchToDatabase("ADD_NEW_DECK_TO_TABLE", {
      table: this.props.table,
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
        <div onClick={this.reset}>reset game</div>
        <div>{hands}</div>
        <br />
        <TrickScore
          game={this.props.table[this.props.table.length - 1]}
        />
        <div />

        <Trick
          getMaxTrick={this.getMaxTrick}
          cards={cards}
          cardsByPlayer={cardsByPlayer}
        />
      </div>
    );
  }
}
