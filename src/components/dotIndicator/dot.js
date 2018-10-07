import React from "react";
import PropTypes from "prop-types";

export const Dot = ({current, page, changePage}) => {
  return (
    <div
      onClick={() => changePage(page)}
      className={current ? "dot current" : "dot"}
    />
  );
};
