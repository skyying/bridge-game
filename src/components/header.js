import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log("COMP: Header");
    return (
      <div>
        <div>curent user: {this.props.user}</div>
        <Link to="/lobby">Back to Lobby</Link>
              this is Header
      </div>
    );
  }
}
