import React from "react";
import PropTypes from "prop-types";
import SUIT_SHAPE from "../constant/SuitShape/index.tsx";

/*
 * item: an player bid result on auction state
 * scale: a number between 0 to 1 for adjust bid result suit size
 */

export const AcutionResultItem = ({item, scale}) => {
  if (item && item.opt) {
    return <div className="bid-result">{item.opt}</div>;
  }
  if (item && item.trick >= 0) {
    const ShapeComponent = SUIT_SHAPE[item.trump];
    return (
      <div className="bid-result">
        <div>{item.trick + 1}</div>
        <ShapeComponent scale={scale}/>
      </div>
    );
  }
  return <div className="bid-result" />;
};


AcutionResultItem.propTypes = {
  item: PropTypes.object,
  scale: PropTypes.number
};
