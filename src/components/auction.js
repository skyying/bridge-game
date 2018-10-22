import React from "react";
import PropTypes from "prop-types";
import {SUIT_SHAPE, BID_NUM} from "./constant.js";
import {getRandomKey} from "../helper/helper.js";
import {dispatchToDatabase} from "../reducer/reducer.js";
import {AuctionList} from "./auctionList.js";
import {Thumbnail} from "./thumbnail.js";
import "../style/auction.scss";

export default class Auction extends React.Component {
  constructor(props) {
    super(props);
    let {game} = this.props;
    this.state = {
      currentTrick: game.bid.trick,
      visibility: false,
      current: null
    };
    this.updateBid = this.updateBid.bind(this);
    this.validateUserTurnAndsetTrump = this.validateUserTurnAndsetTrump.bind(
      this
    );
  }
  validateUserTurnAndsetTrump(index) {
    // check if already current user's turn to give his bid
    let {game, currentUser, players} = this.props;
    if (!currentUser || !game) return;
    if (players && currentUser) {
      // if currentUser's Index is same as game deal, let him give bid

      let currentUserIndex = players.findIndex(
        player => player === this.props.currentUser.uid
      );
      if (currentUserIndex === game.deal) {
        this.setState({
          currentTrick: index,
          current: index,
          visibility: true
        });
      }
    }
  }
  updateBid(trump, opt = null) {
    let newBid,
      isFinishAuction = false,
      declarer = this.props.game.bid.declarer;

    let result = this.props.game.bid.result || [];
    if (trump > -1 && trump !== null) {
      let bid = {
        trick: this.state.currentTrick,
        trump: trump
      };
      // udpate result
      result.push(Object.assign({}, bid));

      // update bid taker, when give a trump bid,
      // record who is the last bid giver;
      declarer = this.props.game.deal;

      newBid = Object.assign(
        {},
        this.props.game.bid,
        bid,
        {declarer: declarer},
        {result: result}
      );
    } else {
      result.push({opt: opt});
      // is game start
      if (result.length >= 4) {
        let isAllPass = result
          .slice(result.length - 4, result.length)
          .every(res => res.opt === "Pass");

        //
        let hasValidTrump = result.some(bid => bid.trump >= 0);
        isFinishAuction = isAllPass && hasValidTrump;
      }

      // update bid
      newBid = Object.assign({}, this.props.game.bid, {
        result: result
      });
    }

    let deal = this.props.game.deal;

    // if (isFinishAuction) {
    //   deal = (declarer + 1) % 4;
    // } else {
    //   deal = (deal + 1) % 4;
    // }

    let newGame = Object.assign(
      {},
      this.props.game,
      {bid: newBid},
      {deal: (deal + 1) % 4}
    );

    dispatchToDatabase("UPDATE_AUCTION", {
      table: this.props.table,
      game: newGame
    });
    this.setState({visibility: false, current: null});
  }
  render() {
    let {game, players} = this.props;
    let {playerInfo} = this.props.table;
    let isCurrentUser =
            players && players[game.deal] === this.props.currentUser.uid;

    let value = game.bid.trick * 5 + game.bid.trump;

    // todo: refactor
    let trickOpt, trumpOpt;
    if (value < 0) {
      trickOpt = Array.from({length: 7})
        .fill(0)
        .map((opt, index) => index);
      trumpOpt = Array.from({length: 5})
        .fill(0)
        .map((opt, index) => index);
    } else if (value === 34) {
      trickOpt = [];
      trumpOpt = [];
    } else if (value % 5 === 4 && value !== 0) {
      trickOpt = Array.from({length: 7})
        .fill(0)
        .map((opt, index) => index)
        .filter(opt => opt > game.bid.trick);
      trumpOpt = Array.from({length: 5})
        .fill(0)
        .map((opt, index) => index);
    } else {
      trickOpt = Array.from({length: 7})
        .fill(0)
        .map((opt, index) => index)
        .filter(opt => opt >= game.bid.trick);
      trumpOpt = Array.from({length: 5})
        .fill(0)
        .map((opt, index) => index)
        .filter(opt => opt > game.bid.trump);
    }

    let allTrickOpt = trickOpt.map((opt, index) => (
      <button
        className={opt === this.state.current ? "current" : null}
        onClick={() => {
          this.validateUserTurnAndsetTrump(opt);
        }}
        key={getRandomKey()}>
        {opt + 1}
      </button>
    ));

    let selectedTrump =
            this.state.currentTrick === trickOpt[0]
              ? trumpOpt
              : [0, 1, 2, 3, 4];

    if (value === 34) {
      selectedTrump = [];
    }
    selectedTrump = selectedTrump.map(opt => (
      <div onClick={() => this.updateBid(opt, null)} key={getRandomKey()}>
        {SUIT_SHAPE[opt](0.25)}
      </div>
    ));

    let result = game.bid.result;

    let DoubleBtn = result &&
            !result[result.length - 1].opt && (
      <button
        className="d-btn"
        onClick={() => this.updateBid(-1, "Double")}>
                    Dboule
      </button>
    );

    let ReDoubleBtn = result &&
            result[result.length - 1].opt === "Double" && (
      <button
        className="d-btn"
        onClick={() => this.updateBid(-1, "ReDouble")}>
                    ReDouble
      </button>
    );

    let playerThumbnails = players.map((player, index) => (
      <div
        key={`auction-thumbnail-${index}`}
        className={
          index === this.props.game.deal
            ? "default-thumbnail current"
            : "default-thumbnail"
        }>
        <div className="default-thumbnail-inner">
          <div className="default-thumbnail-inner-outline-wrapper">
            <div className="default-thumbnail-inner-outline">
              <Thumbnail
                size={53}
                current={index === this.props.game.deal}
                name={playerInfo[player].displayName}
              />
            </div>
          </div>
          <span>{playerInfo[player].displayName}</span>
        </div>
      </div>
    ));
    if (this.props.isFinishAuction) {
      return null;
    }

    return (
      <div className="auction-inner">
        <div className="thumbnail-group">{playerThumbnails}</div>
        {!game.bid.result && (
          <div className="notes"> Start Auction </div>
        )}
        <AuctionList scale={0.2} result={game.bid.result} />
        <div className="option-wrapper">
          {isCurrentUser && (
            <div className="other-btns">
              <button
                className="pass"
                onClick={() => this.updateBid(null, "Pass")}>
                                Pass
              </button>
              {DoubleBtn}
              {ReDoubleBtn}
            </div>
          )}
          <div className="tricks">{allTrickOpt}</div>
          {this.state.visibility && (
            <div className="trumps">{selectedTrump}</div>
          )}
        </div>
      </div>
    );
  }
}
