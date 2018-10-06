import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {dispatch, store} from "../reducer/reducer.js";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
    this.handleName = this.handleName.bind(this);
  }
  handleName(e) {
    this.setState({name: e.target.value});
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
          to="/lobby">
                    login
        </Link>
        <br />
        <Link onClick={() => this.props.login("1")} to="/lobby">
                    player 1
        </Link>
        <br />
        <Link onClick={() => this.props.login("C-1")} to="/lobby">
                    player C-1
        </Link>
        <br />
        <Link onClick={() => this.props.login("C-2")} to="/lobby">
                    player C-2
        </Link>
        <br />
        <Link onClick={() => this.props.login("C-3")} to="/lobby">
                    player C-3
        </Link>
      </div>
    );
  }
}
