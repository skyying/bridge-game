import React from "react";
import PropTypes from "prop-types";
import {SUIT_SHAPE, BID_NUM} from "./constant.js";
import {getRandomKey} from "../helper/helper.js";

export default class Auction extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let game = this.props.game;
    let bid = game.bid;
    let trickOption = BID_NUM.map(num => (
      <button key={getRandomKey()}>{num}</button>
    ));
    let trumpOption = Object.keys(SUIT_SHAPE).map(opt => (
      <span key={getRandomKey()}>{SUIT_SHAPE[opt](0.2)}</span>
    ));

    return (
      <div>
        <h2>auction</h2>
        <span>current Bid trick: {game.bid[0]}  trump:{game.bid[1]}</span>
        <div> {trickOption}</div>
        <div>{trumpOption}</div>
        
      </div>
    );
  }
}
