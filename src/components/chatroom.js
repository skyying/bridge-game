import React from "react";
import reactDOM from "react-dom";
import PropTypes from "prop-types";
import {app} from "../firebase/firebase.js";
import {dispatch, dispatchToDatabase} from "../reducer/reducer.js";

export default class Chatroom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ""
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  handleKeyPress(e) {
    if (e.key === "Enter" && this.state.message.length) {
      this.sendMessage();
    }
  }
  sendMessage(e) {
    dispatchToDatabase("SEND_MESSAGE_TO_CHATROOM", {
      message: this.state.message,
      currentUser: this.props.currentUser,
      table: this.props.table
    });
    this.setState({message: ""});
  }
  handleChange(e) {
    this.setState({message: e.currentTarget.value});
  }
  render() {
    if (!chatroom) {
      return null;
    }
    console.log(chatroom);
    let {currentUser, table, chatroom} = this.props;
    let chatLen = 30;
    let end = Object.keys(chatroom.message).length;
    let chatStart = end - chatLen >= 0 ? end - chatLen : 0;
    let messageList;
    if (chatroom && chatroom.message) {
      messageList = Object.keys(chatroom.message)
        .sort((a, b) => +a - +b)
        .slice(chatStart, end)
        .map((id, index) => (
          <div key={`message-${index}`}>
            {chatroom.message[id].user}
            {chatroom.message[id].content}
          </div>
        ));
    }

    console.log("chatroom", chatroom);
    return (
      <div>
        <div>{messageList}</div>

        <input
          type="textarea"
          value={this.state.message}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
        <button onClick={this.sendMessage}>send</button>
      </div>
    );
  }
}
