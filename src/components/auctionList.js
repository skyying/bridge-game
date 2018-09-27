import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {SUIT_SHAPE} from "./constant.js";
import {getRandomKey} from "../helper/helper.js";

export const AuctionList = ({result, scale}) => {
  if (!result) {
    return null;
  }
  let resultsNum = result.length;

  return (
    <div className="record">
      {Array.from({length: Math.ceil(resultsNum / 4)})
        .fill(0)
        .map((res, index) => (
          <div key={getRandomKey()} className="row">
            {Array.from({length: 4})
              .fill(0)
              .map((re, j) => {
                let resultItem = result[index * 4 + j];
                if (resultItem && resultItem.opt) {
                  return (
                    <div
                      key={getRandomKey()}
                      className="bid-result">
                      {resultItem.opt}
                    </div>
                  );
                } else if (
                  resultItem &&
                                    resultItem.trick >= 0
                ) {
                  return (
                    <div
                      key={getRandomKey()}
                      className="bid-result">
                      <div>{resultItem.trick + 1}</div>
                      {SUIT_SHAPE[resultItem.trump](
                        scale,
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={getRandomKey()}
                      className="bid-result">
                      {null}
                    </div>
                  );
                }
              })}
          </div>
        ))}
    </div>
  );
};
