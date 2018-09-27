import React from "react";
import PropTypes from "prop-types";
import {SUIT_SHAPE, BID_NUM} from "./constant.js";
import {getRandomKey} from "../helper/helper.js";
import {dispatchToDatabase} from "../reducer/reducer.js";
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
    this.setTrump = this.setTrump.bind(this);
    this.updateBid = this.updateBid.bind(this);
  }
  setTrump(index) {
    this.setState({currentTrick: index, current: index, visibility: true});
  }
  updateBid(trump, opt = null) {
    let newBid,
      isGameStart = false;

    if (trump >= 0 && trump !== null) {
      let bid = {
        trick: this.state.currentTrick,
        trump: trump
      };
      // udpate result
      let result = this.props.game.bid.result || [];
      result.push(Object.assign({}, bid));
      // update bid
      newBid = Object.assign({}, this.props.game.bid, bid, {
        result: result
      });
    } else {
      let result = this.props.game.bid.result || [];
      result.push({opt: opt});

      // is game start
      if (result.length > 4) {
        isGameStart = result
          .slice(result.length - 4)
          .every(res => res.opt === "Pass");
      }

      // update bid
      newBid = Object.assign({}, this.props.game.bid, {
        result: result
      });
    }

    let deal = this.props.game.deal;
    deal = (deal + (isGameStart ? 1 : 1)) % 4;

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
        onClick={() => this.setTrump(opt)}
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
    let resultList;
    if (result) {
      let resultsNum = result.length;
      resultList = Array.from({length: Math.ceil(resultsNum / 4)})
        .fill(0)
        .map((res, index) => (
          <div key={getRandomKey()} className="row">
            {Array.from({length: 4})
              .fill(0)
              .map((re, j) => {
                let resultItem = result[index * 4 + j];
                if (resultItem && resultItem.opt) {
                  return (
                    <div
                      key={getRandomKey()}
                      className="bid-result">
                      {resultItem.opt}
                    </div>
                  );
                } else if (
                  resultItem &&
                                    resultItem.trick >= 0
                ) {
                  return (
                    <div
                      key={getRandomKey()}
                      className="bid-result">
                      <div>{resultItem.trick + 1}</div>
                      {SUIT_SHAPE[resultItem.trump](0.2)}
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={getRandomKey()}
                      className="bid-result">
                      {null}
                    </div>
                  );
                }
              })}
          </div>
        ));
    }
    let isFinishAuction;
    if (result) {
      isFinishAuction =
                result.length >= 4 &&
                result.some(bid => bid.trick >= 0) &&
                result
                  .slice(result.length - 3)
                  .every(res => res.opt === "Pass");
    }

    if (isFinishAuction) return null;

    return (
      <div className="auction-inner">
        <div className="thumbnail-group">{playerThumbnails}</div>
        {game.bid &&
                    game.bid.result &&
                    game.bid.result.length > 0 && (
          <div className="record">{resultList}</div>
        )}
        <div>
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

// <h1>{this.props.game.players[this.props.game.deal]}</h1>
// <div className="row">
//   <div className="bid-result" />
//   <div className="bid-result">PASS</div>
//   <div className="bid-result">PASS</div>
//   <div className="bid-result">PASS</div>
// </div>
// <h1>{this.props.game.players[this.props.game.deal]}</h1>
