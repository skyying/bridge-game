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
    let {table, windowWidth, windowHeight} = this.props;
    let {game, players} = table;
    if (!game || !game.bid.result) {
      return null;
    }
    let playerThumbnails = players.map((player, index) => (
      <div key={getRandomKey()} className="thumbnail">
        <span>{player[0]}</span>
      </div>
    ));
    return (
      <div
        className="auction-result"
        style={{
          top: Math.ceil(windowWidth / 500) * 5,
          right: Math.ceil(windowWidth / 500) * 5
        }}>
        <div className="auction-result-inner">
          <div className="thumbnail-group">{playerThumbnails}</div>
          <AuctionList scale={0.15} result={game.bid.result} />
        </div>
      </div>
    );
  }
}
