import React from "react";
import PropTypes from "prop-types";
import {SUIT_SHAPE, BID_NUM} from "./constant.js";
import {getRandomKey} from "../helper/helper.js";
import {dispatchToDatabase} from "../reducer/reducer.js";
import {AuctionList} from "./auctionList.js";
import "../style/auction.scss";

export default class Auction extends React.Component {
  constructor(props) {
    super(props);
    let game = this.props.game;
    this.state = {
      currentTrick: game.bid.trick,
      visibility: false,
      current: null
    };
    this.updateBid = this.updateBid.bind(this);
    this.validateUserTurnAndsetTrump = this.validateUserTurnAndsetTrump.bind(
      this,
    );
  }
  validateUserTurnAndsetTrump(index) {
    // check if already current user's turn to give his bid
    if (!this.props.currentUser || !this.props.game) return;
    let game = this.props.game;

    if (game.players && this.props.currentUser) {
      // if currentUser's Index is same as game deal, let him give bid

      let currentUserIndex = game.players.findIndex(
        player => player === this.props.currentUser,
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

    if (trump >= 0 && trump !== null) {
      let bid = {
        trick: this.state.currentTrick,
        trump: trump
      };
      // udpate result
      let result = this.props.game.bid.result || [];
      result.push(Object.assign({}, bid));

      // update bid taker, when give a trump bid,
      // record who is the last bid giver;
      declarer = this.props.game.deal;

      newBid = Object.assign(
        {},
        this.props.game.bid,
        bid,
        {declarer: declarer},
        {result: result},
      );
    } else {
      let result = this.props.game.bid.result || [];
      result.push({opt: opt});

      // is game start

      if (result.length >= 4) {
        let isAllPass = result
          .slice(result.length - 3, result.length)
          .every(res => res.opt === "Pass");
        let isGreaterThanFour = result.length >= 4;
        let hasValidTrump = result.some(bid => bid.trick >= 0);

        isFinishAuction =
                    isAllPass && isGreaterThanFour && hasValidTrump;
      }

      // update bid
      newBid = Object.assign({}, this.props.game.bid, {
        result: result
      });
    }

    let deal = this.props.game.deal;
    if (isFinishAuction) {
      deal = (declarer + 1) % 4;
    } else {
      deal = (deal + 1) % 4;
    }

    let newGame = Object.assign(
      {},
      this.props.game,
      {bid: newBid},
      {deal: deal},
    );

    dispatchToDatabase("UPDATE_AUCTION", {
      id: this.props.tableId,
      gameIndex: this.props.gameIndex,
      game: newGame
    });

    this.setState({visibility: false, current: null});
  }
  render() {
    let {game, tableId, gameIndex} = this.props;
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

    let playerThumbnails = this.props.game.players.map((player, index) => (
      <div
        key={getRandomKey()}
        className={
          index === this.props.game.deal
            ? "thumbnail current"
            : "thumbnail"
        }>
        <span>{player[0]}</span>
      </div>
    ));
    if (this.props.isFinishAuction) return null;

    return (
      <div className="auction-inner">
        <div className="thumbnail-group">{playerThumbnails}</div>
        {!game.bid.result && (
          <div className="notes"> Start Auction </div>
        )}
        <AuctionList scale={0.2} result={game.bid.result} />
        <div className="option-wrapper">
          <div className="tricks">{allTrickOpt}</div>
          {this.state.visibility && (
            <div className="trumps">
              {selectedTrump}
              <button
                className="pass"
                onClick={() => this.updateBid(null, "Pass")}>
                                Pass
              </button>
              {DoubleBtn}
              {ReDoubleBtn}
            </div>
          )}
        </div>
      </div>
    );
  }
}

// {game.bid &&
//             game.bid.result &&
//             game.bid.result.length > 0 && (
//   <div className="record">{resultList}</div>
// )}

// <h1>{this.props.game.players[this.props.game.deal]}</h1>
// <div className="row">
//   <div className="bid-result" />
//   <div className="bid-result">PASS</div>
//   <div className="bid-result">PASS</div>
//   <div className="bid-result">PASS</div>
// </div>
// <h1>{this.props.game.players[this.props.game.deal]}</h1>
