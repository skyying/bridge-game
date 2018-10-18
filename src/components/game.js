import "../style/reset.scss";
import "../style/game.scss";
import React from "react";
import PropTypes from "prop-types";
import {getRandomInt, getRandomKey} from "../helper/helper.js";
import {dispatch, dispatchToDatabase} from "../reducer/reducer.js";
import {Card} from "./card.js";
import {Redirect} from "react-router-dom";
import Trick from "./trick.js";
import {
  CARD_NUM,
  DIRECTION,
  EMPTY_SEAT,
  NO_TRUMP,
  DEFAULT_GAME
} from "./constant.js";
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
  shuffleCards,
  getHandPosByCardNum
} from "./examineCards.js";
import {getWinnerCard} from "./getWinnerCard.js";
import PlayerReadyList from "./playerReadyList.js";

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    let {game} = this.props.table;
    this.state = {
      endAuction: game && game.order >= 0,
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

    // todo, refine logic, under some condition, state might not be update
    // if ready state is change
    if (
      !newTable.ready.every(
        (player, index) => player === oldTable.ready[index]
      )
    ) {
      // and are all ready
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
    // if (!this.props.table || this.props.table.game) return;
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
    console.log("value", value);
    let {table} = this.props;
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
          table: table,
          value: value,
          time: new Date().getTime(),
          maxTrick: this.getNextMaxTrick(),
          order: order,
          deal: (game.deal + 1) % 4
        }
      )
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
          table: table,
          winnerCard: card,
          order: order,
          deal: card.player
        })
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
    // if (!this.state.redirectToLogin) {
    //   return <Redirect />;
    // }
    let {table, currentUser} = this.props;

    console.log("in game table", table);

    let {game, players, ready} = table;
    let {cards, isGameOver} = game;

    let isEndOfCurrentTrick = game.order % 4 === 3;
    let isFinishAuction = this.getAuctionStatus(game);
    // set true to give dummy's card to declarer
    let isDummyMode = isFinishAuction && true;

    // class name for each hand
    let hands;
    let {cardsByPlayer, offsetPlayers, offsetIndex} =
            getOffsetDatabyCurrentUser(players, game, currentUser.uid) || {};

    // turn cards to 4 hands
    if (cards && cards.length === CARD_NUM.TOTAL) {
      let currentUserIndex = players.findIndex(
        user => user === currentUser.uid
      );

      // if dummy mode, let it be dummy's index, esle let it be something larger
      let flipIndex = isDummyMode ? (game.bid.declarer + 2) % 4 : 6;
      let isValidFlipIndex = flipIndex < 4;

      if (isValidFlipIndex) {
        // udpate dummy hand's index in offset player list
        flipIndex = offsetPlayers.findIndex(
          player => player === players[flipIndex]
        );
      }

      let currentTurnPlayer = players[game.deal];
      let isCurrentUserPlayer = players.includes(currentUser.uid);

      // cardsByPlayer already offset by current login user's index
      hands = cardsByPlayer.map((hand, index) => {
        let playerHand = offsetPlayers[index];
        let playerHandIndex = index; // zero will alwasy be current login user

        // makesure dummy hand can view declarer's card
        if (flipIndex === 0) {
          flipIndex = 2;
        }

        // only show cards didn't played
        hand = hand
          .sort((a, b) => a.value - b.value)
          .filter(card => card.trick === 0);

        if (playerHandIndex === 1 && flipIndex !== 1) {
          hand = hand.sort((a, b) => b.value - a.value);
        }

        let currentUserIndex = 0;

        // handle display issue for both weat/east players
        let handCopy = hand.map(userHand =>
          Object.assign({}, userHand)
        );

        let display = [[], [], [], []];
        handCopy.map(card =>
          display[Math.floor(card.value / CARD_NUM.HAND)].push(card)
        );

        // handle flip down card, group them into n rows base on
        // how many cards left
        display = display.filter(item => item.length !== 0);

        // decide to flip down which players card
        // use playerHandIndex to decide , playerHandIndex 0 means current user
        // if current user is not a player, show sorted cards and don't flip them
        if (
          playerHandIndex !== currentUserIndex &&
                    playerHandIndex !== flipIndex &&
                    isCurrentUserPlayer
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
          display.flat()
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
              currentUser.uid === declarerPlayer &&
                            playerHandIndex === 2
            ) {
              canBeClick = true;
            }
            if (
              currentUser.uid === dummyPlayer &&
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
              key={`card-random-${i}`}
              value={card.value}
            />
          ));
        });

        // calculate hand style and card postion
        let totalCardsInHand = cardsInHand
          .map(suit => suit.length)
          .reduce((sum, len) => sum + len, 0);
        let totalSuitType = cardsInHand.filter(
          suit => suit.length !== 0
        ).length;

        // handle resize
        let sidebarWidth = this.state.windowWidth >= 1200 ? 480 : 400;
        let horCardOffset = 40;
        let cardSize = 100;

        // console.log("verHandPos", verHandPos);
        let horCardStyle =
                    DIRECTION[index] === "north" || DIRECTION[index] === "south"
                      ? {
                        left:
                                  (this.state.windowWidth -
                                      sidebarWidth -
                                      (horCardOffset * totalCardsInHand +
                                          horCardOffset)) /
                                  2
                      }
                      : null;

        const getHandHeight = suitNum => {
          let cardh = 125,
            shift = 70;
          return (
            suitNum * cardh - (cardh - shift) * (suitNum - 1) + 10
          );
        };

        // console.log("cardsInHand", cardsInHand);
        let verTopPos =
                    DIRECTION[index] === "west" || DIRECTION[index] === "east"
                      ? (this.state.windowHeight -
                              getHandHeight(totalSuitType)) /
                          2
                      : null;

        let verEdgePos;

        // let verHandPos = getHandPosByCardNum(
        //   cardsInHand,
        //   cardSize,
        //   horCardOffset,
        //   this.state.windowWidth
        // );

        if (verTopPos && DIRECTION[index] === "west") {
          verEdgePos = {top: verTopPos};
        }
        if (verTopPos && DIRECTION[index] === "east") {
          verEdgePos = {top: verTopPos};
        }
        // console.log("verHandPos", verHandPos);
        // let verEdgePos = () => {
        //   if (verTopPos && DIRECTION[index] === "west") {
        //     return Object.assign({}, verTopPos, {left: verHandPos});
        //   } else if (verTopPos && DIRECTION[index] === "east") {
        //     return Object.assign({}, verTopPos, {
        //       right: verHandPos
        //   }
        // };

        // console.log("verEdgePos", verEdgePos);

        return (
          <div
            className={DIRECTION[index]}
            style={horCardStyle || verEdgePos}
            key={`player-hand-index-${index}`}>
            <div className="hand-inner">
              <div className="user-hand">{cardsInHand}</div>
              <Player
                current={
                  currentTurnPlayer === playerHand &&
                                    isFinishAuction
                }
                name={
                  (table.playerInfo[playerHand] &&
                                        table.playerInfo[playerHand]
                                          .displayName) ||
                                    "Anonymous"
                }
              />
            </div>
          </div>
        );
      });
    } // end of cards

    let isAllReady = table.ready.every(player => player === true);

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
              table={table}
            />
          </div>
        </div>
      );
    }

    let startTime = table.linkId;
    if (!isAllReady && table.record) {
      startTime = table.timeStamp;
    }

    return (
      <div className="game">
        {!isAllReady && (
          <PlayerReadyList
            startTime={startTime}
            suffleCardsWhenReady={this.suffleCardsWhenReady}
            currentUser={currentUser}
            table={this.props.table}
          />
        )}
        {isFinishAuction && (
          <AuctionResult
            currentUser={currentUser}
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
              game={game}
              table={table}
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
            currentUser={currentUser}
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
      </div>
    );
  }
}
