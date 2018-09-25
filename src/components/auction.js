import React from "react";
import PropTypes from "prop-types";
import {SUIT_SHAPE, BID_NUM} from "./constant.js";
import {getRandomKey} from "../helper/helper.js";
import {dispatchToDatabase} from "../reducer/reducer.js";

export default class Auction extends React.Component {
  constructor(props) {
    super(props);

    let game = this.props.game;
    this.state = {
      currentTrick: game.bid.trick
    };
    this.setTrump = this.setTrump.bind(this);
    this.updateBid = this.updateBid.bind(this);
  }
  setTrump(index) {
    this.setState({currentTrick: index});
  }
  updateBid(trump, opt = null) {
    let newBid;
    if (trump >= 0) {
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
      // update bid
      newBid = Object.assign({}, this.props.game.bid, {
        result: result
      });
    }

    let deal = this.props.game.deal;
    deal = (deal + 1) % 4;

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
  }
  render() {
    let {game, tableId, gameIndex} = this.props;
    let value = game.bid.trick * 4 + game.bid.trump;
    // todo: refactor
    let trickOpt, trumpOpt;
    if (value < 0) {
      trickOpt = Array.from({length: 7})
        .fill(0)
        .map((opt, index) => index);
      trumpOpt = Array.from({length: 5})
        .fill(0)
        .map((opt, index) => index);
    } else if (value === 28) {
      trickOpt = [];
      trumpOpt = [];
    } else if (value % 4 === 0 && value !== 0) {
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
      <button onClick={() => this.setTrump(opt)} key={getRandomKey()}>
        {opt + 1}
      </button>
    ));

    let selectedTrump =
            this.state.currentTrick === trickOpt[0]
              ? trumpOpt
              : [0, 1, 2, 3, 4];

    if (value === 28) {
      selectedTrump = [];
    }
    selectedTrump = selectedTrump.map(opt => (
      <div onClick={() => this.updateBid(opt, null)} key={getRandomKey()}>
        {SUIT_SHAPE[opt](0.2)}
      </div>
    ));
    let result = game.bid.result;

    let DoubleBtn = result &&
            !result[result.length - 1].opt && (
      <button onClick={() => this.updateBid(-1, "Double")}>
                    Dboule
      </button>
    );

    let ReDoubleBtn = result &&
            result[result.length - 1].opt === "Double" && (
      <button onClick={() => this.updateBid(-1, "ReDouble")}>
                    ReDouble
      </button>
    );

    return (
      <div>
        <h2>auction</h2>
        <div>
          <h3>Bid record</h3>
        </div>
        <div>
          <h3> Auction </h3>
          {DoubleBtn}
          {ReDoubleBtn}
          <button onClick={() => this.updateBid(null, "Pass")}>
                        pass
          </button>
          <div>{allTrickOpt}</div>
          <div>{selectedTrump}</div>
        </div>
      </div>
    );
  }
}
