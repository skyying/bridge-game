import React from "react";
import PropTypes from "prop-types";
import {getRandomInt, getRandomKey} from "../helper/helper.js";
import {dispatch, dispatchToDatabase} from "../reducer/reducer.js";
import {Card, CardWithClickEvt} from "./card.js";
import Trick from "./trick.js";
import {CARD_NUM, EMPTY_SEAT, NO_TRUMP} from "./constant.js";
import {TrickScore} from "./trickScore.js";
import Auction from "./auction.js";

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.currentMaxTrick = this.currentMaxTrick.bind(this);
    this.deal = this.deal.bind(this);
    this.getNextMaxTrick = this.getNextMaxTrick.bind(this);
    this.handleWinner = this.handleWinner.bind(this);
    this.reset = this.reset.bind(this);
    this.shuffle = this.shuffle.bind(this);
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
  getNextMaxTrick() {
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
  currentMaxTrick() {
    let table = this.props.table;
    if (!table) return;
    let cards = table[table.length - 1].cards;
    return Math.max(...cards.map(card => card.trick));
  }
  handleWinner(value) {
    let table = this.props.table,
      game = table[table.length - 1],
      cards = table[table.length - 1].cards,
      maxTrick = this.currentMaxTrick();

    let [_, trump] = game.bid;
    let cardsMatchCurrentTrick = cards
      .map((card, index) => Object.assign({}, card, {index: index}))
      .filter(
        card =>
          (card.trick === maxTrick && card.trick > 0) ||
                    card.value === value,
      );
    let winnerCard,
      noTrumpCards = false;

    if (cardsMatchCurrentTrick.length === 4) {
      // which card is first been played
      let first = Math.min(
        ...cardsMatchCurrentTrick.map(card => card.order),
      );
      let [firstHand] = cardsMatchCurrentTrick.filter(
        card => card.order === first,
      );
      // which card has max value by the bid trump
      const findMaxValueByTrump = (arr, trump) => {
        let list = arr
          .filter(
            item =>
              Math.floor(item.value / CARD_NUM.HAND) === trump,
          )
          .sort((cardA, cardB) => cardB.value - cardA.value);
        return list.length ? list[0] : null;
      };
      // trump matters most, else, decide by what first hand
      if (trump !== NO_TRUMP) {
        // filter trump cards, and compare their face value
        let tmp = findMaxValueByTrump(cardsMatchCurrentTrick, trump);
        if (tmp) {
          winnerCard = tmp;
        } else {
          noTrumpCards = true;
        }
      } else if (trump === NO_TRUMP || noTrumpCards) {
        // if their quotient are the same, compare their value, else, let first win
        let trumpRef = Math.floor(firstHand.value / CARD_NUM.HAND);
        winnerCard = findMaxValueByTrump(
          cardsMatchCurrentTrick,
          trumpRef,
        );
      } // end of no trump
    }

    return winnerCard || null;
  }
  deal(value) {
    let table = this.props.table;
    if (!table) {
      return;
    }
    dispatchToDatabase("UPDATE_CURRENT_TRICK", {
      table: table,
      value: value,
      maxTrick: this.getNextMaxTrick(),
      id: this.props.tableId,
      order: table[table.length - 1].order + 1
    });

    let winnerCard = this.handleWinner(value);

    // make sure winnerCard exists, and write winner to database
    if (winnerCard) {
      // remove index data while dispatch to database
      let card = Object.assign({}, winnerCard);
      delete card.index;

      dispatchToDatabase("UPDATE_WINNER_CARD", {
        winnerCard: card,
        table: table,
        id: this.props.tableId
      });
    }
  }
  reset() {
    let tableId = this.props.tableId;
    dispatchToDatabase("RESET_GAME", {
      data: {cards: null, players: ["a", "b", "c", "d"]},
      id: tableId
    });
  }
  shuffle() {
    // refactor this to other function
    // default bid trick / trump option
    let bid = [0, -1];
    // create array from 0 - 51
    let cards = Array.from({length: CARD_NUM.TOTAL})
      .fill(0)
      .map((card, i) => i);

    // shuffle array algorithm
    for (let i = cards.length - 1; i > 0; i--) {
      let randomIndex = getRandomInt(0, CARD_NUM.TOTAL - 1);
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
    let game = table.map(game => Object.assign({}, game)).pop();
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
        // } else {
        // should handle case which current user is not player
        // todo:
        // cardsByPlayer = cardsByPlayer.slice(0);
        // playerIDByCurrentUser = players.slice(currentUserIndex);
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
            <h2>{player}</h2>
            <div>{cardsInHand}</div>
          </div>
        );
      });
    } // end of cards

    return (
      <div>
        <div>{domPlayers}</div>
        <div onClick={this.reset}>reset game</div>
        {game.bid && (
          <Auction
            gameIndex={table.length - 1}
            game={game}
            tableId={this.props.tableId}
          />
        )}
        <div>{hands}</div>
        <br />
        <TrickScore game={game} />
        <div />
        <Trick
          cards={cards}
          cardsByPlayer={cardsByPlayer}
          currentMaxTrick={this.currentMaxTrick}
        />
      </div>
    );
  }
}
