import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {getRandomKey} from "../helper/helper.js";
import {AuctionList} from "./auctionList.js";
import "../style/auction.scss";

export class AuctionResult extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let game = this.props.game;
    if (!game || !game.bid.result) {
      return null;
    }
    let playerThumbnails = game.players.map((player, index) => (
      <div key={getRandomKey()} className="thumbnail">
        <span>{player[0]}</span>
      </div>
    ));
    return (
      <div className="auction-result">
        <div className="auction-result-inner">
          <div className="thumbnail-group">{playerThumbnails}</div>
          <AuctionList
            scale={0.15}
            result={this.props.game.bid.result}
          />
        </div>
      </div>
    );
  }
}
