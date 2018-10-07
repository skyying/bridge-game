import React from "react";
import PropTypes from "prop-types";
import {SUIT_SHAPE} from "../constant.js";
import {teamScore} from "../socre.js";

export default class RecordItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let {index, record} = this.props;
    if (!record) {
      return <div className="record-item" ><div className="empty"></div></div>;
    }
    let score = teamScore(record.cards);
    return (
      <div className="record-item active">
        <div>{index + 1}</div>
        <div className="bid">
          <span>{record.bid.trick + 1}</span>
          {SUIT_SHAPE[record.bid.trump](0.15)}
        </div>
        <div>{score.teamA}</div>
        <div>{score.teamB}</div>
      </div>
    );
  }
}
