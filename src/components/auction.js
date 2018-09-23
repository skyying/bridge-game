import React from "react";
import PropTypes from "prop-types";
import {SUIT_SHAPE, BID_NUM} from "./constant.js";
import {getRandomKey} from "../helper/helper.js";
import {dispatchToDatabase} from "../reducer/reducer.js";

export default class Auction extends React.Component {
  constructor(props) {
    super(props);
    this.setBid = this.setBid.bind(this);
    this.validateBid = this.validateBid.bind(this);
  }
  validateBid(bid) {
    let PASS = 5;
    let AllTRUMP = -1;
    let {trick, trump} = this.props.game.bid;
    if (bid.trick >= 0) {
      if (bid.trick > trick) {
        // 0 means bid trick, 1 means trump options
        let newBid = Object.assign({}, this.props.game.bid, {
          trick: bid.trick,
          trump: AllTRUMP
        });
        this.setBid(newBid);
      }
    } else {
      if (bid.trump === PASS) {
        return;
      }
      let newBid = Object.assign({}, this.props.game.bid, {
        trump: bid.trump
      });
      this.setBid(newBid);
    }
  }
  setBid(bid) {
    dispatchToDatabase("UPDATE_AUCTION", {
      id: this.props.tableId,
      gameIndex: this.props.gameIndex,
      bid: bid
    });
  }
  render() {
    let game = this.props.game;
    let {trick, trump} = this.props.game.bid;
    let trickOption = BID_NUM.map((num, index) => {
      // if in that bid trick, all trump options are all selected,
      // don't show that trick option

      if (index > trick || (index === trick && trump < 4)) {
        return (
          <button
            onClick={() => this.validateBid({trick: index})}
            key={getRandomKey()}>
            {num}
          </button>
        );
      } else {
        return null;
      }
    });
    let trumpOption = Object.keys(SUIT_SHAPE).map((opt, index) => {
      if (index > trump || trump === 4) {
        return (
          <button
            onClick={() =>
              this.validateBid({
                trump: index
              })
            }
            key={getRandomKey()}>
            {SUIT_SHAPE[opt](0.2)}
          </button>
        );
      }
    });

    return (
      <div>
        <h2>auction</h2>
        <span>
                    current Bid trick: {game.bid.trick} trump:{game.bid.trump}
        </span>
        <div> {trickOption}</div>
        <div>{trumpOption}</div>
      </div>
    );
  }
}
