import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {dispatch, store} from "../reducer/reducer.js";
import "../style/signup.scss";
import "../style/btn.scss";
import "../style/checkbox.scss";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      uid: ""
    };
    this.handleName = this.handleName.bind(this);
  }
  handleName(e) {
    this.setState({name: e.target.value});
  }
  render() {
    let login = (
      <div>
                login Component
        <input
          onChange={this.handleName}
          type="text"
          value={this.state.name}
        />
        <Link onClick={() => this.props.login(this.state.name)} to="/">
                    login
        </Link>
        <br />
        <Link onClick={() => this.props.login("1")} to="/">
                    player 1
        </Link>
        <br />
        <Link onClick={() => this.props.login("C-1")} to="/">
                    player C-1
        </Link>
        <br />
        <Link onClick={() => this.props.login("C-2")} to="/">
                    player C-2
        </Link>
        <br />
        <Link onClick={() => this.props.login("C-3")} to="/">
                    player C-3
        </Link>
      </div>
    );

    return (
      <div className="singup-wrapper">
        <div className="signup login">
          <h2>Login</h2>
          <div>
            <h3>Email</h3>
            <input
              type="text"
              placeholder="Email address"
              onChange={e => {
                this.setState({email: e.currentTarget.value});
              }}
              value={this.state.email}
            />
          </div>
          <div>
            <h3>Password</h3>
            <input
              placeholder="Enter password"
              type="password"
              onChange={e => {
                this.setState({
                  password: e.currentTarget.value
                });
              }}
              value={this.state.password}
            />
          </div>
          <div>
            <div className="btn-group">
              <button className="btn-style-round">Login</button>
              <button className="btn-style-round fb-sign-btn">
                                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
