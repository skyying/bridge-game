import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "../style/progress.scss";

export const Progress = ({
  totalWidth,
  currentWidth,
  height = 10,
  fg = "#4A90E2",
  bg = "#EAE7DF"
}) => {
  let viewBox = `0 0 200 ${height}`;
  let heightValue = `${height}px`;
  let total = `${totalWidth}`;
  return (
    <div className="">
      <svg width={total} height={height} viewBox={viewBox}>
        <g fill="none" fillRule="evenodd">
          <rect
            fill={bg}
            x="0"
            y="0"
            width={total}
            height={height}
            rx="5"
          />
          <rect
            fill={fg}
            x="0"
            y="0"
            width={currentWidth}
            height={height}
            rx="5"
          />
        </g>
      </svg>
    </div>
  );
};
