import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import GameRecord from "./gameRecord.js";
import GameRewind from "./gameRewind.js";
import {TAB_OPTION} from "../constant.js";
import Chatroom from "../chatroom.js";

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    let {record} = this.props.table;
    this.state = {
      tab: 0,
      currentRecord: record ? record.length - 1 : null
    };
    this.changeRecord = this.changeRecord.bind(this);
    this.handleTab = this.handleTab.bind(this);
  }
  changeRecord(index) {
    this.setState({currentRecord: index});
  }
  handleTab(index) {
    this.setState({tab: index});
  }
  render() {
    if (!this.props.table) return null;
    if (!this.props.isChatroomShown) {
      return null;
    }
    return (
      <div ref={this.props.setRef} className="sidebar">
        <div className="tabs">
          <div className={"current chatroom"}>
            <span />
            <b>chatroom</b>
          </div>
          <span
            onClick={this.props.toggleChatroom}
            className="close-btn">
                        
          </span>
        </div>
        <div className="tab-wrapper" />
        <div>
          <Chatroom
            screenHeight={this.props.screenWidth}
            screenWidth={this.props.screenWidth}
            currentUser={this.props.currentUser}
            chatroom={this.props.chatroom}
            table={this.props.table}
          />
        </div>
      </div>
    );
  }
}

// <div>{currentTabContent}</div>
