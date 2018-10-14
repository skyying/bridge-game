import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "../style/signup.scss";
import "../style/btn.scss";
import "../style/checkbox.scss";

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      email: "",
      password: "",
      comfirm: "",
      agreement: true
    };
  }
  render() {
    return (
      <div className="singup-wrapper">
        <div className="signup">
          <h2>Sign up</h2>
          <div>
            <h3>User name</h3>
            <input
              placeholder="Your name"
              type="text"
              onChange={e => {
                this.setState({user: e.currentTarget.value});
              }}
              value={this.state.user}
            />
          </div>
          <div>
            <h3>Password</h3>
            <input
              placeholder="New password"
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
            <h3>Confirm password</h3>
            <input
              placeholder="Confirm new password"
              type="password"
              onChange={e => {
                this.setState({confirm: e.currentTarget.value});
              }}
              value={this.state.confirm}
            />
          </div>
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
            <label className="checkbox-lable">
              <input id="agreement" type="checkbox" />
              <div
                className={
                  this.state.agreement ? "checked" : ""
                }
              />
              <span>
                                I allow the use of collected data about my study
                                behavior for research purposes. The data
                                contains information from game playing and chat
                                content. No individuals can be identified from
                                publications.
              </span>
            </label>
            <div className="btn-group">
              <button className="btn-style-round">Sign up</button>
              <button className="btn-style-round fb-sign-btn">Facebook</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
