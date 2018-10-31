import "../../style/reset.scss";
import "../../style/thumbnail.scss";
import "../../style/player.scss";
import React from "react";
import PropTypes from "prop-types";
import {Thumbnail} from "../thumbnail";

const Player = ({name, current = null, index}) => {
  return (
    <div
      style={
        index % 2 === 0
          ? {display: "inline-block"}
          : {display: "inline-block", position: "absolute"}
      }>
      <div className={current ? "player current" : "player"}>
        <div className="player-inner">
          <Thumbnail
            robotOffset={-7}
            styleName="border-thumbnail"
            size={current ? 40 : 50}
            offset={5}
            name={name}
            border={current}
          />
        </div>
        <div className="name">{name}</div>
      </div>
    </div>
  );
};

export default Player;
