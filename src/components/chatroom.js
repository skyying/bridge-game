import React from "react";
import PropTypes from "prop-types";
import {DB} from "../firebase/db.js";
import {dispatchToDatabase} from "../reducer/reducer.js";
import randomColor from "randomcolor";
import {SUIT_SHAPE, Emoji} from "./constant.js";

export default class Chatroom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ""
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.addEmoji = this.addEmoji.bind(this);
    this.msgEnd;
    this.emoji = Emoji;
  }
  handleKeyPress(e) {
    // && this.state.message.length
    if (e.key === "Enter") {
      this.sendMessage();
    }
  }
  componentDidMount() {
    this.scrollToBottom();
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }
  addEmoji(emoji) {
    this.setState({message: this.state.message + emoji});
  }
  sendMessage(e) {
    dispatchToDatabase("SEND_MESSAGE_TO_CHATROOM", {
      message: this.state.message,
      currentUser: this.props.currentUser,
      table: this.props.table
    });
    this.setState({
      message: ""
    });
  }
  handleChange(e) {
    this.setState({message: e.currentTarget.value});
  }
  scrollToBottom() {
    // in order to fix message will scroll to bottom
    setTimeout(() => {
      this.msgEnd.scrollIntoView({behavior: "smooth", block: "end"});
    }, 10);
  }
  render() {
    let {currentUser, table, chatroom} = this.props;
    if (!table || !currentUser) {
      return null;
    }
    let {players} = table;
    let messageList;
    let emojiList = this.emoji.map((emj, i) => (
      <a
        key={`emj-${i}`}
        className="emjbtn"
        onClick={() => this.addEmoji(emj)}>
        {emj}
      </a>
    ));

    if (chatroom && chatroom.message && table && table.viewers) {
      let end = Object.keys(chatroom.message).length;
      let chatStart = 0; //end - chatLen >= 0 ? end - chatLen : 0;
      let isCurrentUserAPlayer = players.some(
        player => player === currentUser.uid
      );
      let msgMapList;
      if (isCurrentUserAPlayer) {
        msgMapList = Object.keys(chatroom.message)
          .sort((a, b) => +a - +b)
          .filter(key => chatroom.message[key].isPlayer);
      } else {
        msgMapList = Object.keys(chatroom.message).sort(
          (a, b) => +a - +b
        );
      }

      messageList = msgMapList.map((id, index) => {
        let color = table.viewers[chatroom.message[id].uid];
        let symbol = null;
        let playerIndex = players.findIndex(
          player => player === chatroom.message[id].uid
        );

        if (playerIndex > -1) {
          symbol = (
            <div
              style={{backgroundColor: color}}
              className="symbol">
              {SUIT_SHAPE[playerIndex](0.1, "#ffffff")}
            </div>
          );
        }
        let msg = chatroom.message[id].content;

        return (
          <div className="msg" key={`message-${index}`}>
            <a>
              {symbol}
              <b style={{color: color}}>
                {chatroom.message[id].displayName}{" "}
                <b className="comma">:</b>
              </b>
              {msg}
            </a>
          </div>
        );
      });
    }

    return (
      <div className="chatroom">
        <div className="msg-wrapper">
          {messageList}

          <div
            ref={el => {
              this.msgEnd = el;
            }}
            style={{float: "left", clear: "both"}}>
            <i />
          </div>
        </div>
        <div className="typing-area">
          <textarea
            placeholder="type something..."
            rows="10"
            col="50"
            value={this.state.message}
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
          />
          <div className="emoji">{emojiList}</div>
          <button onClick={this.sendMessage}>送出</button>
        </div>
      </div>
    );
  }
}
