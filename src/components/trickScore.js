import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "../style/trick-score.scss";
import {teamScore} from "./socre.js";

export default class TrickScore extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let {table, windowWidth, windowHeight} = this.props;
    let {game, players} = table;
    if (!table || !table.game.cards) {
      return null;
    }
    let score = teamScore(game.cards);
    let [player1, player2, player3, player4] = players;
    let innerStyle = this.props.innerStyle;
    let resizeRatio = this.props.ratio || 0.15;
    let thumbnailStyle = {
      width: this.props.thumbnailSize,
      height: this.props.thumbnailSize
    };

    return (
      <div
        className={
          this.props.name
            ? `trick-score ${this.props.name}`
            : "trick-score"
        }
        style={innerStyle}>
        <div
          className="trick-score-inner"
          style={{
            width: windowWidth * resizeRatio
          }}>
          <div className="group-wrapper">
            <div className="group">
              <div
                className="thumbnail-group"
                style={{
                  minWidth: this.props.thumbnailSize * 2
                }}>
                <div
                  className="thumbnail"
                  style={thumbnailStyle}>
                  <span>{player1[0]}</span>
                </div>
                <div
                  className="thumbnail"
                  style={thumbnailStyle}>
                  <span>{player3[0]}</span>
                </div>
              </div>
              <div className="score">{score.teamA}</div>
            </div>
            <div className="group">
              <div
                className="thumbnail-group"
                style={{
                  minWidth: this.props.thumbnailSize * 2
                }}>
                <div
                  className="thumbnail"
                  style={thumbnailStyle}>
                  <span>{player2[0]}</span>
                </div>
                <div
                  className="thumbnail"
                  style={thumbnailStyle}>
                  <span>{player4[0]}</span>
                </div>
              </div>
              <div className="score">{score.teamB}</div>
            </div>
          </div>
          {this.props.children}
        </div>
      </div>
    );
  }
}
