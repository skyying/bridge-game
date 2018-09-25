import "../style/reset.scss";
import "../style/player.scss";
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
export const Player = ({name}) => {
  return (
    <div className="player">
      <div className="thumbnail" />
      <div className="name">{name}</div>
    </div>
  );
};
