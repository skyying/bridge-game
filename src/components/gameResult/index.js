import React from "react";
import PropTypes from "prop-types";
import "../../style/trick-score.scss";
import {ThumbailGroupWithTag} from "../thumbnail";
import TeamScore from "../../logic/teamscore.js";

export default class GameResult extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let {
      table,
      windowWidth,
      windowHeight,
      currentUser,
      canSwitchToSmallerPanel
    } = this.props;
    let {game, players} = table;
    if (!table || !table.game.cards) {
      return null;
    }

    let score = new TeamScore(table, currentUser);
    let scoreboard = score.getDefaultScore(game);

    let {playerInfo} = table;

    // let score = teamScore(game.cards);
    let playerList = players.map(key => {
      if (playerInfo[key]) {
        return playerInfo[key].displayName;
      } else {
        return "Anonymous";
      }
    });

    let innerStyle = this.props.innerStyle;
    let resizeRatio = this.props.ratio || 0.15;
    let thumbnailStyle = {
      width: this.props.thumbnailSize,
      height: this.props.thumbnailSize
    };

    let offset = 3;
    let thumbnailSize = this.props.thumbnailSize * 1.2;
    let styleName = canSwitchToSmallerPanel ? "smaller-panel" : "";

    return (
      <div
        className={
          this.props.name
            ? `trick-score ${this.props.name} ${styleName}`
            : `trick-score ${styleName}`
        }
        style={innerStyle}>
        <div className="trick-score-inner">
          <div className="group-wrapper">
            <div className="group">
              <ThumbailGroupWithTag
                styleObj={{
                  minWidth: thumbnailSize * 2
                }}
                teamOrder={0}
                players={playerList}
                size={thumbnailSize}
                offset={offset}
                currentUser={currentUser}
              />
              <div className="score">{scoreboard.teamOne}</div>
            </div>
            <div className="group">
              <ThumbailGroupWithTag
                styleObj={{
                  minWidth: thumbnailSize * 2
                }}
                teamOrder={1}
                players={playerList}
                size={thumbnailSize}
                offset={offset}
                currentUser={currentUser}
              />
              <div className="score">{scoreboard.teamTwo}</div>
            </div>
          </div>
          {this.props.children}
        </div>
      </div>
    );
  }
}
