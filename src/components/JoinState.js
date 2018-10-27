import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import PlayerReadyList from "./playerReadyList.js";

class JoinState extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <PlayerReadyList
          currentUser={this.props.currentUser}
          table={this.props.table}
        />
      </div>
    );
  }
}
export default JoinState;
