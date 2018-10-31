import "../../style/trick-score.scss";
import React from "react";
import PropTypes from "prop-types";
import {ThumbailGroupWithTag} from "../thumbnail";
import TeamScore from "../../logic/teamscore.js";

// get player name
const getPlayer = ({players, playerInfo}) => {
  return players.map(
    key => (playerInfo[key] ? playerInfo[key].displayName : "Anonymous")
  );
};

// get grouped team thumbnails and their score
const getTeamThumbnail = (table, currentUser) => {
  const OFFSET = 3;
  let score = new TeamScore(table, currentUser);
  let scoreboard = score.getDefaultScore(table.game);
  return Object.keys(scoreboard).map((teamName, index) => {
    return (
      <div key={`team-${index}`} className="group">
        <ThumbailGroupWithTag
          teamOrder={index}
          players={getPlayer(table)}
          offset={OFFSET}
          currentUser={currentUser}
        />
        <div className="score">{scoreboard[teamName]}</div>
      </div>
    );
  });
};

// return game result base on current player is in which team
const GameResult = ({table, currentUser, children}) => {
  if (!table) {
    return null;
  }
  return (
    <div className="trick-score right-bottom-pos">
      <div className="trick-score-inner">
        <div className="group-wrapper">
          {getTeamThumbnail(table, currentUser)}
        </div>
        {children}
      </div>
    </div>
  );
};

GameResult.propTypes = {
  table: PropTypes.object,
  currentUser: PropTypes.object,
  children: PropTypes.element
};

export default GameResult;
