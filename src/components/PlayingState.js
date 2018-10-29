import React from "react";
import PropTypes from "prop-types";
import Trick from "./trick.js";
import PlayingInfo from "./playingInfo.js";
import {Card} from "./card.js";
import TrickLogic from "../logic/trick.js";
import {dispatchToDatabase} from "../reducer/reducer.js";
import {GAME_STATE, DIRECTION} from "./constant.js";
import {Player} from "./player.js";
import Hands from "../logic/hands.js";
import {getWinnerCard} from "./getWinnerCard.js";
import Layout from "../logic/layout.js";

export default class PlayingState extends React.Component {
  constructor(props) {
    super(props);
    this.trickModel = new TrickLogic();
    ["play"].forEach(name => {
      this[name] = this[name].bind(this);
    });
  }
  play(value) {
    let {table} = this.props;
    let {game} = this.props.table;
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
  componentDidMount() {
    this.hands = new Hands(this.props.table, this.props.currentUser);
  }
  render() {
    this.hands = new Hands(this.props.table, this.props.currentUser);
    let {table} = this.props;
    let {game, playerInfo} = table;
    let isEndOfCurrentTrick = game.order % 4 === 3;
    let HEADER_HEIGHT = 60;
    let remainingScreenHeight = this.props.windowHeight - HEADER_HEIGHT;

    let posInfo = {
      horizonOffset: 40,
      verticalOffset: 70,
      playerHeight: 66,
      cardWidth: 100,
      cardHeight: 125,
      width: this.props.windowWidth - this.props.sidebarWidth,
      height: remainingScreenHeight
    };

    const layout = new Layout(this.hands, posInfo);

    let hands = this.hands.all.map((hand, index) => {
      let cardsInHand = hand.map((suit, i) => {
        return suit.map((card, j) => {
          return (
            <Card
              name={
                card.canBeClick
                  ? `click-able l${card.pos[0]} item-${
                    card.pos[1]
                  }`
                  : `l${card.pos[0]} item-${card.pos[1]}`
              }
              flipUp={card.flipUp}
              evt={card.canBeClick ? this.play : null}
              key={`card-random-${index}-${i}-${j}`}
              value={card.value}
            />
          );
        });
      });

      let playHand = this.hands.offsetPlayers[index];
      let playerName = playerInfo[playHand].displayName;
      let isCurrentPlayer =
                this.hands.currentTurnPlayer === playHand &&
                table.gameState === GAME_STATE.playing;
      return (
        <div
          style={layout.style[index]}
          className={DIRECTION[index]}
          key={`player-hand-index-${index}`}>
          <div className="hand-inner">
            <div className="user-hand">{cardsInHand}</div>
            <Player index={index} current={isCurrentPlayer} name={playerName} />
          </div>
        </div>
      );
    });
    return (
      <div>
        <PlayingInfo {...this.props} />
        <div className="arena">
          <div className="hands">{hands}</div>
          <Trick
            cards={table.game.cards}
            cardsByPlayer={this.hands.offsetCards}
            order={table.game.order}
            isTrickFinish={isEndOfCurrentTrick}
          />
        </div>
      </div>
    );
  }
}
