import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { dispatch, store } from "../reducer/reducer.js";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "leslie"
    };
    this.handleName = this.handleName.bind(this);
  }
  handleName(e) {
    this.setState({ name: e.target.value });
  }
  render() {
    return (
      <div>
                login Component
        <input
          onChange={this.handleName}
          type="text"
          value={this.state.name}
        />
        <Link
          onClick={() => this.props.login(this.state.name)}
          to="/lobby"
        >
                    login
        </Link>
      </div>
    );
  }
}
