import "../style/reset.scss";
import "../style/player.scss";
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {Thumbnail} from "./thumbnail.js";
export const Player = ({name, current = null}) => {
  return (
    <div className={current ? "player current" : "player"}>
      <Thumbnail size={38} />
      <div className="name">{name}</div>
    </div>
  );
};
