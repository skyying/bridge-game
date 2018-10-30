import React from "react";
import PropTypes from "prop-types";
import {SUIT_SHAPE} from "./constant.js";

export const AcutionResultItem = ({item, scale}) => {
  if (item && item.opt) {
    return <div className="bid-result">{item.opt}</div>;
  }
  if (item && item.trick >= 0) {
    return (
      <div className="bid-result">
        <div>{item.trick + 1}</div>
        {SUIT_SHAPE[item.trump](scale)}
      </div>
    );
  }
  return <div className="bid-result" />;
};
