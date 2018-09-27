import "../style/reset.scss";
import "../style/game.scss";
import React from "react";
import PropTypes from "prop-types";
import {getRandomInt, getRandomKey} from "../helper/helper.js";
import {dispatch, dispatchToDatabase} from "../reducer/reducer.js";
import {Card, CardWithClickEvt, CardFilpDown} from "./card.js";
import Trick from "./trick.js";
import {CARD_NUM, EMPTY_SEAT, NO_TRUMP} from "./constant.js";
import {TrickScore} from "./trickScore.js";
import Auction from "./auction.js";
import {Player} from "./player.js";
import {AuctionResult} from "./auctionResult.js";

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    let game = this.props.table[this.props.table.length - 1];
    this.state = {
      endAuction: game.order >= 0
    };
    this.currentMaxTrick = this.currentMaxTrick.bind(this);
    this.deal = this.deal.bind(this);
    this.getNextMaxTrick = this.getNextMaxTrick.bind(this);
    this.handleWinner = this.handleWinner.bind(this);
    this.reset = this.reset.bind(this);
    this.shuffle = this.shuffle.bind(this);
    this.suffleCardsWhenReady = this.suffleCardsWhenReady.bind(this);
    this.endAuction = this.endAuction.bind(this);
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

  // so far, how many tricks have been played ?
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
      cards = game.cards,
      maxTrick = this.currentMaxTrick();

    let {trump} = game.bid;
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
      // trump matters most, else, decide by what first hand has draw
      if (trump !== NO_TRUMP) {
        // filter trump cards, and compare their face value
        let tmp = findMaxValueByTrump(cardsMatchCurrentTrick, trump);
        if (tmp !== null) {
          winnerCard = tmp;
        } else {
          noTrumpCards = true;
        }
      }

      if (trump === NO_TRUMP || noTrumpCards) {
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
  endAuction() {
    this.setState({endAuction: true});
  }
  deal(value) {
    let table = this.props.table;
    if (!table) {
      return;
    }
    let game = table[table.length - 1];
    let currentPlayer = game.deal;

    dispatchToDatabase("UPDATE_CURRENT_TRICK", {
      table: table,
      value: value,
      maxTrick: this.getNextMaxTrick(),
      id: this.props.tableId,
      order: game.order + 1,
      deal: (currentPlayer + 1) % 4
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
    let bid = {isDb: false, isRdb: false, trick: 0, trump: -1};
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
      }
      // create dom element by cards in user's hand
      hands = cardsByPlayer.map((hand, index) => {
        let player = playerIDByCurrentUser[index];
        let playerIndex = index;
        hand = hand
          .sort((a, b) => a.value - b.value)
          .filter(card => card.trick === 0);
        if (index === 1) {
          hand = hand.sort((a, b) => b.value - a.value);
        }
        // handle display issue for both weat/east players
        let handCopy = hand.map(userHand =>
          Object.assign({}, userHand),
        );
        let display = [[], [], [], []];
        let newHand = handCopy.map(card =>
          display[Math.floor(card.value / 13)].push(card),
        );

        // handle flip down card, group them into n rows base on
        // how many cards left
        display = display.filter(item => item.length !== 0);
        // decide to flip down which players card
        // use playerIndex to decide , playerIndex 0 means current user
        if (playerIndex > 0) {
          let flat = display.flat();
          let len = flat.length;
          if (Math.floor(len / 3) < 1 && len > 1) {
            let mid = Math.floor(len / 2);
            flat = [flat.slice(0, mid), flat.slice(mid, len)];
            display = flat;
          } else if (Math.floor(len / 3) > 1) {
            let threeRow = [[], [], []];
            flat.map((card, index) =>
              threeRow[index % 3].push(card),
            );
            display = threeRow;
          }
        }

        // handle sort isssue of west player, should sort
        // from big to small
        let cardsInHand = display.map((each, index) => {
          // use playerIndex to decide flip up whose cards
          // playerIndex === 0 means current user
          if (playerIndex === 0) {
            return each.map((card, i) => (
              <CardWithClickEvt
                name={`l${index} item-${i}`}
                isFront={true}
                evt={this.deal}
                isOpen={true}
                key={getRandomKey()}
                value={card.value}
              />
            ));
          } else {
            return each.map((card, i) => {
              return (
                <CardFilpDown
                  name={`l${index} item-${i}`}
                  key={getRandomKey()}
                />
              );
            });
          }
        });

        // calculate hand style and card postion
        let totalCardsInHand = cardsInHand
          .map(suit => suit.length)
          .reduce((sum, len) => sum + len, 0);
        let totalSuitType = cardsInHand.filter(
          suit => suit.length !== 0,
        ).length;

        let horCardStyle =
                    direction[index] === "north" || direction[index] === "south"
                      ? {
                        left:
                                  (window.innerWidth -
                                      (50 * totalCardsInHand + 50)) /
                                  2
                      }
                      : null;

        const getHandHeight = suitNum => {
          let cardh = 125,
            shift = 80;
          return (
            suitNum * cardh - (cardh - shift) * (suitNum - 1) + 10
          );
        };

        let verCardStyle =
                    direction[index] === "west" || direction[index] === "east"
                      ? {
                        top:
                                  (window.innerHeight -
                                      getHandHeight(totalSuitType)) /
                                  2
                      }
                      : null;
        return (
          <div
            className={direction[index]}
            style={horCardStyle || verCardStyle}
            key={getRandomKey()}>
            <div className="hand-inner">
              <div className="user-hand">{cardsInHand}</div>
              <Player name={player} />
            </div>
          </div>
        );
      });
    } // end of cards

    let isFinishAuction;
    if (game && game.bid && game.bid.result) {
      let result = game.bid.result;
      isFinishAuction =
                result.length >= 4 &&
                result.some(bid => bid.trick >= 0) &&
                result
                  .slice(result.length - 3)
                  .every(res => res.opt === "Pass");
    }
    return (
      <div className="game">
        {isFinishAuction && <AuctionResult game={game} />}
        <div className="auction">
          {game.bid && (
            <Auction
              isFinishAuction={isFinishAuction}
              endAuction={this.endAuction}
              gameIndex={table.length - 1}
              game={game}
              tableId={this.props.tableId}
            />
          )}
        </div>
        <div className="arena">
          <div className="hands">{hands}</div>
          <Trick
            cards={cards}
            cardsByPlayer={cardsByPlayer}
            currentMaxTrick={this.currentMaxTrick}
          />
          <TrickScore game={game} />
        </div>
        <div className="sidebar" />
      </div>
    );
  }
}

// <div onClick={this.reset}>reset game</div>
// {game.bid && (
//   <Auction
//     gameIndex={table.length - 1}
//     game={game}
//     tableId={this.props.tableId}
//   />
// )}

// <div>this is game comp</div>
// <div>{domPlayers}</div>
