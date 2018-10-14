import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import RecordItem from "./recordItem.js";
import {ThumbailGroup} from "../thumbnail.js";
import {Dot} from "../dotIndicator/dot.js";

export default class GameRecord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0
    };
    this.changePage = this.changePage.bind(this);
  }
  changePage(page) {
    this.setState({page: page});
  }
  render() {
    let resultNum = 3;
    let {record} = this.props;
    if (!record) {
      return (
        <div className="record-empty">No available game records</div>
      );
    }
    let recordList, dots, dotsNum;
    if (record) {
      if (record.length <= resultNum) {
        record = record.concat([null, null, null]).slice(0, resultNum);
      } else {
        let start = this.state.page * resultNum;
        let end =
                    start + resultNum >= record.length
                      ? record.length
                      : start + resultNum;
        record =
                    end === start + resultNum
                      ? record.slice(start, end)
                      : record.slice(start, end);
      }
      recordList = record.map((recordItem, index) => (
        <RecordItem
          key={`record-item-${index}`}
          index={index}
          changeRecord={this.props.changeRecord}
          current={this.props.currentRecord === index}
          record={recordItem}
        />
      ));

      dotsNum = Math.ceil(record.length / resultNum);
      dots =
                dotsNum <= 1
                  ? null
                  : (dots = Array.from({length: dotsNum})
                    .fill(0)
                    .map((dotItem, index) => (
                      <Dot
                        key={`dot-${index}`}
                        changePage={this.changePage}
                        page={index}
                        current={index === this.state.page}
                      />
                    )));
    }

    return (
      <div className="record-list">
        {this.props.record && (
          <div className="record-header">
            <div />
            <div />
            <ThumbailGroup
              teamOrder={0}
              players={this.props.players}
              size={32}
            />
            <ThumbailGroup
              teamOrder={1}
              players={this.props.players}
              size={32}
            />
          </div>
        )}
        {recordList}
        <div className="dots-holder">
          <div className="dots-holder-inner">{dots}</div>
        </div>
      </div>
    );
  }
}
