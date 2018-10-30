import React from "react";
import PropTypes from "prop-types";
import {SUIT_SHAPE, BID_NUM} from "./constant.js";
import {getRandomKey} from "../helper/helper.js";
import {dispatchToDatabase} from "../reducer/reducer.js";
import {AuctionList} from "./auctionList.js";
import {Thumbnail} from "./thumbnail.js";
import {AuctionThumbnails} from "./auctionThumbnails.js";
import {getAuctionOpt} from "../logic/auction.js";
import "../style/auction.scss";

export default class Auction extends React.Component {
  constructor(props) {
    super(props);
    let {game} = this.props.table;
    this.state = {
      currentTrick: game.bid.trick,
      visibility: false,
      current: null
    };

    ["updateBid", "validateUserTurnAndsetTrump"].forEach(name => {
      this[name] = this[name].bind(this);
    });
  }
  validateUserTurnAndsetTrump(index) {
    // check if already current user's turn to give his bid
    let {game, players} = this.props.table;
    let {currentUser} = this.props;
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
      declarer = this.props.table.game.bid.declarer;

    let result = this.props.table.game.bid.result || [];
    if (trump > -1 && trump !== null) {
      let bid = {
        trick: this.state.currentTrick,
        trump: trump
      };
      // udpate result
      result.push(Object.assign({}, bid));

      // update bid taker, when give a trump bid,
      // record who is the last bid giver;
      declarer = this.props.table.game.deal;

      newBid = Object.assign(
        {},
        this.props.table.game.bid,
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
      newBid = Object.assign({}, this.props.table.game.bid, {
        result: result
      });
    }

    let deal = this.props.table.game.deal;

    let newGame = Object.assign(
      {},
      this.props.table.game,
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
    let {table, currentUser} = this.props;
    let {players, playerInfo, game} = table;

    let isCurrentUser =
            players && players[game.deal] === this.props.currentUser.uid;

    let {trickOpt, trumpOpt, value, isLastOpt} = getAuctionOpt(game);

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

    return (
      <div className="auction-inner">
        <div className="thumbnail-group">
          <AuctionThumbnails
            players={this.props.table.players}
            playerInfo={this.props.table.playerInfo}
            currentTurn={this.props.table.game.deal}
          />
        </div>
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
