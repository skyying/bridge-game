import "../style/reset.scss";
import "../style/game.scss";
import React from "react";
import PropTypes from "prop-types";
import {getRandomInt, getRandomKey} from "../helper/helper.js";
import {dispatch, dispatchToDatabase} from "../reducer/reducer.js";
import {Card} from "./card.js";
import Trick from "./trick.js";
import {CARD_NUM, EMPTY_SEAT, NO_TRUMP, DEFAULT_GAME} from "./constant.js";
import TrickScore from "./trickScore.js";
import ScoreBoard from "./scoreBoard.js";
import Auction from "./auction.js";
import {Player} from "./player.js";
import {AuctionResult} from "./auctionResult.js";
import PlayerReadyList from "./playerReadyList.js";

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    let game = this.props.table[this.props.table.length - 1];
    this.state = {
      endAuction: game.order >= 0,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    };
    this.currentMaxTrick = this.currentMaxTrick.bind(this);
    this.deal = this.deal.bind(this);
    this.getNextMaxTrick = this.getNextMaxTrick.bind(this);
    this.handleWinner = this.handleWinner.bind(this);
    this.shuffle = this.shuffle.bind(this);
    this.suffleCardsWhenReady = this.suffleCardsWhenReady.bind(this);
    this.endAuction = this.endAuction.bind(this);
    this.handleResize = this.handleResize.bind(this);
    // when player is ready, shuffle cards
    // this.suffleCardsWhenReady();
  }
  handleResize() {
    this.setState({
      windowWidth: window.innerWidth,
      height: window.innerHeight
    });
  }
  componentDidMount() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
  componentDidUpdate(prevProps) {
    let newGame = this.props.table[this.props.table.length - 1];
    let oldGame = prevProps.table[prevProps.table.length - 1];
    if (
      !newGame.ready.every(
        (player, index) => player === oldGame.ready[index],
      )
    ) {
      if (newGame.ready.every(player => player === true)) {
        this.suffleCardsWhenReady();
      }
    }
  }
  suffleCardsWhenReady() {
    // when seats is full and has no cards on databse
    let table = this.props.table;
    if (table) {
      let curentGame = table.slice(0).pop();
      let isFourSeatsFull = curentGame.players.every(
        seat => seat !== EMPTY_SEAT,
      );
      if (isFourSeatsFull && !curentGame.cards) {
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
    let order = game.order + 1;

    dispatchToDatabase("UPDATE_CURRENT_TRICK", {
      table: table,
      value: value,
      maxTrick: this.getNextMaxTrick(),
      id: this.props.tableId,
      order: order,
      deal: (game.deal + 1) % 4
    });

    let winnerCard = this.handleWinner(value);

    // make sure winnerCard exists, and write winner to database
    if (winnerCard) {
      // remove index data while dispatch to database
      let card = Object.assign({}, winnerCard);
      delete card.index;

      dispatchToDatabase("UPDATE_WINNER_CARD", {
        winnerCard: card,
        order: order,
        deal: card.player,
        table: table,
        id: this.props.tableId
      });
    }
  }
  shuffle() {
    // refactor this to other function
    // default bid trick / trump option
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
      cards: cards
    });
  }

  render() {
    let table = this.props.table;
    let game = table.map(game => Object.assign({}, game)).pop();
    let {cards, players, ready, isGameOver} = game;

    // what is the first card of current trick
    // in order to let players only can draw card as the same suit
    let firstCard;
    // every run, first player to draw can draw any card
    if (cards && cards.length >= 4 && game.order % 4 !== 3) {
      firstCard =
                cards
                  .filter(card => card.order % 4 === 0)
                  .sort((cardA, cardB) => cardB.order - cardA.order)[0] ||
                null;
    }
    let isEndOfCurrentTrick = game.order % 4 === 3;

    // check if fishish auction
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

    // set true to give dummy's card to declarer
    let dummyMode = isFinishAuction && true;

    // class name for each hand
    let direction = ["south", "west", "north", "east"];

    let cardsByPlayer, playerIDByCurrentUser, hands;

    // turn cards to 4 hands
    if (cards && cards.length === CARD_NUM.TOTAL) {
      cardsByPlayer = players.map((userIndex, index) => {
        return cards.filter((card, i) => i % players.length === index);
      });

      // shift current user's index to zero, so their cards will
      // shown on bottom

      let currentUserIndex = players.findIndex(
        user => user === this.props.currentUser,
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
      let flipIndex = dummyMode ? (game.bid.declarer + 2) % 4 : 6;
      if (flipIndex < 4) {
        flipIndex = playerIDByCurrentUser.findIndex(
          player => player === game.players[flipIndex],
        );
      }

      hands = cardsByPlayer.map((hand, index) => {
        let player = playerIDByCurrentUser[index];
        let playerIndex = index; // zero will alwasy be current login user

        // makesure dummy hand can view declarer's card
        if (flipIndex === 0) {
          flipIndex = 2;
        }

        hand = hand
          .sort((a, b) => a.value - b.value)
          .filter(card => card.trick === 0);
        if (index === 1) {
          hand = hand.sort((a, b) => b.value - a.value);
        }

        let currentUserIndex = game.players.findIndex(
          player => player === this.props.currentUser,
        );

        currentUserIndex = 0;

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

        if (
          playerIndex !== currentUserIndex &&
                    playerIndex !== flipIndex
        ) {
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

        let cardItems = display.flat();
        let hasSameSuitWithFirstCard =
                    firstCard &&
                    cardItems.filter(card => {
                      return (
                        Math.floor(card.value / 13) ===
                            Math.floor(firstCard.value / 13)
                      );
                    }).length > 0;

        let cardsInHand = display.map((each, index) => {
          // use playerIndex to decide flip up whose cards
          // playerIndex === 0 means current user

          let canBeClick =
                        isFinishAuction &&
                        players[game.deal] === player &&
                        playerIndex === currentUserIndex;

          let flipUp =
                        playerIndex === currentUserIndex ||
                        playerIndex === flipIndex;

          // if those card has same suit with first player,
          // users need only to draw those cards
          // if not, they can draw any cards
          let allowClickEvt = card => {
            return (
              firstCard === null ||
                            !hasSameSuitWithFirstCard ||
                            Math.floor(card.value / 13) ===
                                Math.floor(firstCard.value / 13)
            );
          };

          return each.map((card, i) => (
            <Card
              name={
                canBeClick && allowClickEvt(card)
                  ? `click-able l${index} item-${i}`
                  : `l${index} item-${i}`
              }
              flipUp={flipUp}
              evt={
                canBeClick && allowClickEvt(card)
                  ? this.deal
                  : null
              }
              key={getRandomKey()}
              value={card.value}
            />
          ));
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
                                  (this.state.windowWidth -
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
                                  (this.state.windowHeight -
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
              <Player
                current={
                  players[game.deal] === player &&
                                    isFinishAuction
                }
                name={player}
              />
            </div>
          </div>
        );
      });
    } // end of cards

    // dom elements

    if (isGameOver) {
      return (
        <div className="game">
          <div>
            <ScoreBoard
              startGame={this.suffleCardsWhenReady}
              currentUser={this.props.currentUser}
              windowWidth={this.state.windowWidth}
              widnowHeight={this.state.windowHeight}
              tableId={this.props.tableId}
              gameIndex={table.length - 1}
              game={game}
            />
          </div>
        </div>
      );
    }
    let isAllReady = game.ready.every(player => player === true);

    return (
      <div className="game">
        {!isAllReady && (
          <PlayerReadyList
            suffleCardsWhenReady={this.suffleCardsWhenReady}
            currentUser={this.props.currentUser}
            game={game}
            tableId={this.props.tableId}
            gameIndex={table.length - 1}
          />
        )}
        {
          // should delete this
          //
          // <div>
          //   <ScoreBoard
          //     startGame={this.suffleCardsWhenReady}
          //     currentUser={this.props.currentUser}
          //     windowWidth={this.state.windowWidth}
          //     widnowHeight={this.state.windowHeight}
          //     tableId={this.props.tableId}
          //     gameIndex={table.length - 1}
          //     game={game}
          //   />
          // </div>
        }
        {
          // should delete this
        }
        <div onClick={this.suffleCardsWhenReady}>shuffle</div>
        {isFinishAuction && (
          <AuctionResult
            windowWidth={this.state.windowWidth}
            windowHeight={this.state.windowHeight}
            game={game}
          />
        )}
        <div className="auction">
          {game.bid &&
                        game.cards && (
            <Auction
              currentUser={this.props.currentUser}
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
            order={game.order}
            isTrickFinish={isEndOfCurrentTrick}
          />
          <TrickScore
            resizeRatio={0.15}
            innerStyle={{
              bottom: Math.ceil(this.state.windowWidth / 500) * 5,
              right: Math.ceil(this.state.windowWidth / 500) * 5
            }}
            thumbnailSize={30}
            name="right-bottom-pos"
            windowWidth={this.state.windowWidth}
            widnowHeight={this.state.windowHeight}
            game={game}
          />
        </div>

        <div className="sidebar" />
      </div>
    );
  }
}
