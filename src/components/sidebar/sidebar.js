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
    // let options = TAB_OPTION.map((opt, i) => (
    //   <div
    //     onClick={() => this.handleTab(i)}
    //     className={this.state.tab === i ? `current ${opt}` : `${opt}`}
    //     key={`opt-${i}`}>
    //     <span />
    //     <b>{opt}</b>
    //   </div>
    // ));
    // let currentRecord = null;
    // if (this.props.table.record) {
    //   currentRecord =
    //             this.state.currentRecord >= 0 &&
    //             this.props.table.record[this.state.currentRecord];
    // }

    // let domRecord = (
    //   <div>
    //     <GameRecord
    //       players={this.props.table.players}
    //       record={this.props.table.record || null}
    //       changeRecord={this.changeRecord}
    //       currentRecord={this.state.currentRecord}
    //     />
    //     <GameRewind
    //       players={this.props.table.players}
    //       record={currentRecord}
    //     />
    //   </div>
    // );
    // let domChatroom = (
    //   <Chatroom
    //     currentUser={this.props.currentUser}
    //     chatroom={this.props.chatroom}
    //     table={this.props.table}
    //   />
    // );

    // let currentTabContent = this.state.tab === 0 ? domChatroom : domRecord;

    return (
      <div className="sidebar">
        <div className="tabs" style={{marginLeft: 30}}>
          <div className={"current chatroom"}>
            <span />
            <b>chatroom</b>
          </div>
        </div>
        <div className="tab-wrapper" />
        <div>
          <Chatroom
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
