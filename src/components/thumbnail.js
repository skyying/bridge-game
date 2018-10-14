import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "../style/thumbnail.scss";

export const Thumbnail = ({name = "", size = 30, src = false}) => {
  let img = src ? <img src={src} /> : <span>{name[0]}</span>;

  return (
    <div
      className="thumbnail"
      style={{
        width: size,
        height: size,
        borderRadius: size
      }}>
      {img}
    </div>
  );
};

export const ThumbailGroup = ({players, size, teamOrder}) => {
  let team = players.filter((player, index) => index % 2 === teamOrder);
  let members = team.map((player, index) => (
    <Thumbnail key={`member-${index}`} name={player} size={size} />
  ));
  return <div className="thumbnail-group">{members}</div>;
};
