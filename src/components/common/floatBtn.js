import React from "react";
import PropTypes from "prop-types";

/*
 * clickEvt : a function pass in to FloatBtn click event
 */
export const FloatBtn = ({clickEvt}) => {
  return <div onClick={clickEvt} className="chat-icon" />;
};

FloatBtn.propTypes = {
  clickEvt: PropTypes.func
};
