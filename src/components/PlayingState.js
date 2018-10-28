import React from "react";
import PropTypes from "prop-types";
import Trick from "./trick.js";
import PlayingInfo from "./PlayingInfo.js";
import {Card} from "./card.js";
import TrickLogic from "./trickModel/trick.js";
import {dispatchToDatabase} from "../reducer/reducer.js";
import {CARD_NUM, DIRECTION, EMPTY_SEAT, TOTAL_TRICKS} from "./constant.js";
import {Player} from "./player.js";
import {
  hasSameSuitWithFirstCard,
  getOffsetDatabyCurrentUser,
  mapFlipDownCards
} from "./examineCards.js";
import {getWinnerCard} from "./getWinnerCard.js";

export default class PlayingState extends React.Component {
  constructor(props) {
    super(props);
    this.trickModel = new TrickLogic();
    ["play"].forEach(name => {
      this[name] = this[name].bind(this);
    });
  }

  play(value) {
    console.log("click play");
    let {table} = this.props;
    let {game} = this.props.table;
    if (!game) {
      return;
    }

    let order = game.order + 1;

    dispatchToDatabase(
      "UPDATE_CURRENT_TRICK",
      Object.assign(
        {},
        {
          table: table,
          value: value,
          time: new Date().getTime(),
          maxTrick: this.trickModel.getNextTrickCount(game),
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
  render() {
    let {table, currentUser, isFinishAuction} = this.props;

    console.log("isFinishAuction, in player comp", isFinishAuction);

    let {game, players} = table;
    let {cards} = game;

    let isEndOfCurrentTrick = game.order % 4 === 3;

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
          display[Math.floor(card.value / TOTAL_TRICKS)].push(card)
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
        let firstCard = this.trickModel.getFirstCardOfCurrentTrick(
          game
        );

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
                            Math.floor(card.value / TOTAL_TRICKS) ===
                                Math.floor(firstCard.value / TOTAL_TRICKS)
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
                  ? this.play
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

        let sidebarWidth = this.props.sidebarWidth;

        let horCardOffset = 40;
        let cardSize = 100;

        let horCardStyle =
                    DIRECTION[index] === "north" || DIRECTION[index] === "south"
                      ? {
                        left:
                                  (this.props.windowWidth -
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

        let verTopPos =
                    DIRECTION[index] === "west" || DIRECTION[index] === "east"
                      ? (this.props.windowHeight -
                              getHandHeight(totalSuitType)) /
                          2
                      : null;

        let verEdgePos;

        if (verTopPos && DIRECTION[index] === "west") {
          verEdgePos = {top: verTopPos};
        }
        if (verTopPos && DIRECTION[index] === "east") {
          verEdgePos = {top: verTopPos};
        }

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

    let gameStyleName;

    if (this.props.isChatroomShown) {
      gameStyleName = "game";
    } else {
      gameStyleName = "game full";
    }

    return (
      <div>
        <PlayingInfo {...this.props} />
        <div className="arena">
          <div className="hands">{hands}</div>
          <Trick
            cards={table.game.cards}
            cardsByPlayer={cardsByPlayer}
            order={table.game.order}
            isTrickFinish={isEndOfCurrentTrick}
          />
        </div>
      </div>
    );
  }
}
