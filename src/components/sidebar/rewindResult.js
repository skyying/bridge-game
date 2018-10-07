import React from "react";
import PropTypes from "prop-types";
import {ThumbailGroup} from "../thumbnail.js";
import {teamScore} from "../socre.js";

export const RewindResult = ({players, cards}) => {
  let score = teamScore(cards);
  return (
    <div className="rewind-result">
      <h3>Result</h3>
      <div>
        <ThumbailGroup teamOrder={0} players={players} size={20} />
        <div>{score.teamA}</div>
      </div>
      <div>
        <ThumbailGroup teamOrder={1} players={players} size={20} />
        <div>{score.teamB}</div>
      </div>
    </div>
  );
};
