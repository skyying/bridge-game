import React from "react";
import PropTypes from "prop-types";
import {AcutionResultItem} from "./auctionResultItem.js";

export const AuctionList = ({result, scale}) => {
  if (!result) {
    return null;
  }
  let COLUMNS_NUM = 4;
  let resultsNum = result.length;
  let rows = Array.from({length: Math.ceil(resultsNum / COLUMNS_NUM)}).fill(
    0
  );
  let columns = [0, 0, 0, 0];

  let resultRows = rows.map((row, rowIndex) => {
    let items = columns.map((col, colIndex) => {
      let resultItem = result[rowIndex * COLUMNS_NUM + colIndex];
      return (
        <AcutionResultItem
          key={`result-item-opt-${colIndex}`}
          item={resultItem}
          scale={scale}
        />
      );
    });
    return (
      <div key={`result-item-${rowIndex}`} className="row">
        {items}
      </div>
    );
  });
  return <div className="record">{resultRows}</div>;
};
