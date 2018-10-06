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
import {
  hasSameSuitWithFirstCard,
  getOffsetDatabyCurrentUser,
  mapFlipDownCards,
  getFirstCard,
  shuffleCards
} from "./examineCards.js";
import {getWinnerCard} from "./getWinnerCard.js";
import PlayerReadyList from "./playerReadyList.js";
import Timer from "./timer.js";

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    let {game} = this.props.table;
    this.state = {
      endAuction: game.order >= 0,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    };
    this.deal = this.deal.bind(this);
    this.getNextMaxTrick = this.getNextMaxTrick.bind(this);
    this.shuffle = this.shuffle.bind(this);
    this.suffleCardsWhenReady = this.suffleCardsWhenReady.bind(this);
    this.endAuction = this.endAuction.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.getAuctionStatus = this.getAuctionStatus.bind(this);
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
    let newTable = this.props.table;
    let oldTable = prevProps.table;

    if (
      !newTable.ready.every(
        (player, index) => player === oldTable.ready[index],
      )
    ) {
      if (newTable.ready.every(player => player === true)) {
        this.suffleCardsWhenReady();
      }
    }
  }
  suffleCardsWhenReady() {
    // when seats is full and has no cards on databse
    let {players, game} = this.props.table;
    if (players) {
      let isFourSeatsFull = players.every(seat => seat !== EMPTY_SEAT);
      if (isFourSeatsFull && !game.cards) {
        this.shuffle();
      }
    }
  }
  // so far, how many tricks have been played ?
  getNextMaxTrick() {
    let {game} = this.props.table;
    if (!game) {
      return;
    }
    let cards = game.cards,
      maxTrick = Math.max(...cards.map(card => card.trick)),
      maxTrickNum = cards.filter(card => card.trick === maxTrick).length;
    if (maxTrick === 0 || maxTrickNum >= 4) {
      return maxTrick + 1;
    }
    return maxTrick;
  }
  endAuction() {
    this.setState({endAuction: true});
  }

  deal(value) {
    let {table, tableId} = this.props;
    let {game} = this.props.table;
    if (!game) {
      return;
    }
    let currentPlayer = game.deal;
    let order = game.order + 1;

    dispatchToDatabase(
      "UPDATE_CURRENT_TRICK",
      Object.assign(
        {},
        {
          tableId: tableId,
          table: table,
          value: value,
          time: new Date().getTime(),
          maxTrick: this.getNextMaxTrick(),
          order: order,
          deal: (game.deal + 1) % 4
        },
      ),
    );

    let winnerCard = getWinnerCard(game, value);

    // make sure winnerCard exists, and write winner to database
    if (winnerCard) {
      // remove index data while dispatch to database
      let card = Object.assign({}, winnerCard);
      delete card.index;

      dispatchToDatabase(
        "UPDATE_WINNER_CARD",
        Object.assign({}, this.props, {
          tableId: tableId,
          table: table,
          winnerCard: card,
          order: order,
          deal: card.player
        }),
      );
    }
  }
  shuffle() {
    let cards = shuffleCards();
    // get new cards
    cards = cards.map(card => ({
      value: card,
      trick: 0
    }));
    // todo bid
    dispatchToDatabase("ADD_NEW_DECK_TO_TABLE", {
      table: this.props.table,
      tableId: this.props.tableId,
      cards: cards
    });
  }
  getAuctionStatus(game) {
    // check if fishish auction
    let result = game.bid.result;

    if (!game || !result) {
      return false;
    }
    return (
      result.length >= 4 &&
            result.some(bid => bid.trick >= 0) &&
            result.slice(result.length - 3).every(res => res.opt === "Pass")
    );
  }
  render() {
    let {table, currentUser, tableId} = this.props;
    let {game, players, ready} = table;
    let {cards, isGameOver} = game;

    let isEndOfCurrentTrick = game.order % 4 === 3;
    let isFinishAuction = this.getAuctionStatus(game);
    // set true to give dummy's card to declarer
    let isDummyMode = isFinishAuction && true;

    // class name for each hand
    let direction = ["south", "west", "north", "east"];
    let hands;
    let {cardsByPlayer, offsetPlayers, offsetIndex} =
            getOffsetDatabyCurrentUser(players, game, currentUser) || {};

    // turn cards to 4 hands
    if (cards && cards.length === CARD_NUM.TOTAL) {
      let currentUserIndex = players.findIndex(
        user => user === currentUser,
      );

      // create dom element by cards in user's hand
      let flipIndex = isDummyMode ? (game.bid.declarer + 2) % 4 : 6;

      if (flipIndex < 4) {
        flipIndex = offsetPlayers.findIndex(
          player => player === players[flipIndex],
        );
      }

      let currentTurnPlayer = players[game.deal];
      let isCurrentUserPlayer = players.includes(currentUser);

      hands = cardsByPlayer.map((hand, index) => {
        let playerHand = offsetPlayers[index];
        // let playerHand = offsetPlayers[index];
        let playerHandIndex = index; // zero will alwasy be current login user

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

        let currentUserIndex = 0;

        // handle display issue for both weat/east players
        let handCopy = hand.map(userHand =>
          Object.assign({}, userHand),
        );

        let display = [[], [], [], []];
        handCopy.map(card =>
          display[Math.floor(card.value / CARD_NUM.HAND)].push(card),
        );

        // handle flip down card, group them into n rows base on
        // how many cards left
        display = display.filter(item => item.length !== 0);

        // decide to flip down which players card
        // use playerHandIndex to decide , playerHandIndex 0 means current user
        if (
          playerHandIndex !== currentUserIndex &&
                    playerHandIndex !== flipIndex
        ) {
          let mapResult = mapFlipDownCards(display);
          if (mapResult) {
            display = mapResult;
          }
        }

        // handle sort isssue of west player, should sort
        // from big to small

        let firstCard = getFirstCard(game);

        let hasFollowSameSuit = hasSameSuitWithFirstCard(
          firstCard,
          display.flat(),
        );

        let cardsInHand = display.map((each, index) => {
          // use playerHandIndex to decide flip up whose cards
          // playerHandIndex === 0 means current user
          let declarerIndex = game.bid.declarer;

          let dummyPlayerIndex = (declarerIndex + 2) % 4;
          let dummyPlayer = players[dummyPlayerIndex];

          let declarerPlayer = players[declarerIndex];

          // if player is nither declarer nor dummy plaer
          let isValidCard = isFinishAuction && isCurrentUserPlayer;
          let canBeClick =
                        isValidCard &&
                        // current player is equal to south;
                        currentTurnPlayer === playerHand &&
                        playerHandIndex === currentUserIndex;

          // current turn is dummay hand, and current login user is declare,
          // let current user can control dummy hand's card
          if (
            isDummyMode &&
                        isValidCard &&
                        dummyPlayer === currentTurnPlayer
          ) {
            if (
              currentUser === declarerPlayer &&
                            playerHandIndex === 2
            ) {
              canBeClick = true;
            }
            if (
              currentUser === dummyPlayer &&
                            playerHandIndex === currentUserIndex
            ) {
              canBeClick = false;
            }
          }

          let flipUp =
                        !isCurrentUserPlayer ||
                        playerHandIndex === currentUserIndex ||
                        playerHandIndex === flipIndex;

          // if those card has same suit with first player,
          // users need only to draw those cards
          // if not, they can draw any cards
          let allowClickEvt = card => {
            return (
              firstCard === null ||
                            !hasFollowSameSuit ||
                            Math.floor(card.value / CARD_NUM.HAND) ===
                                Math.floor(firstCard.value / CARD_NUM.HAND)
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
                  currentTurnPlayer === playerHand &&
                                    isFinishAuction
                }
                name={playerHand}
              />
            </div>
          </div>
        );
      });
    } // end of cards

    console.log("table ready in render", table.ready);
    let isAllReady = table.ready.every(player => player === true);
    console.log("isAllReady", isAllReady);

    // dom elements
    if (isGameOver) {
      return (
        <div className="game">
          <div>
            <ScoreBoard
              startGame={this.suffleCardsWhenReady}
              currentUser={currentUser}
              windowWidth={this.state.windowWidth}
              widnowHeight={this.state.windowHeight}
              tableId={tableId}
              table={table}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="game">
        <Timer time={game.time} />
        {!isAllReady && (
          <PlayerReadyList
            suffleCardsWhenReady={this.suffleCardsWhenReady}
            currentUser={currentUser}
            table={this.props.table}
            tableId={this.props.tableId}
          />
        )}
        {isFinishAuction && (
          <AuctionResult
            windowWidth={this.state.windowWidth}
            windowHeight={this.state.windowHeight}
            table={table}
          />
        )}
        <div className="auction">
          {game.bid &&
                        game.cards && (
            <Auction
              isFinishAuction={isFinishAuction}
              endAuction={this.endAuction}
              tableId={tableId}
              game={game}
              currentUser={currentUser}
              players={players}
            />
          )}
        </div>
        <div className="arena">
          <div className="hands">{hands}</div>
          <Trick
            cards={cards}
            cardsByPlayer={cardsByPlayer}
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
            table={this.props.table}
          />
        </div>
        <div className="sidebar" />
      </div>
    );
  }
}
