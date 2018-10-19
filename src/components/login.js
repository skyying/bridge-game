import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {dispatch, store} from "../reducer/reducer.js";
import {Redirect} from "react-router-dom";
import {app} from "../firebase/firebase.js";
import "../style/signup.scss";
import "../style/btn.scss";
import "../style/checkbox.scss";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    let _this = this;
    app.onAuthChanged(user => {
      if (user) {
        _this.setState({redirect: true});
      }
    });
    this.state = {
      name: "",
      email: "",
      password: "",
      redirect: false
    };
    this.handleName = this.handleName.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }
  handleLogin() {
    let auth = app.auth;
    let {email, password} = this.state;
    if (!email || !password) return;
    let promise = auth.signInWithEmailAndPassword(email, password);
    promise
      .then(user => this.setState({redirect: true}))
      .catch(err => this.setState({error: err.message}));
  }

  handleName(e) {
    this.setState({name: e.target.value});
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    return (
      <div className="singup-wrapper">
        <div className="signup login">
          <h2>登入</h2>
          <div>
            <h3>電子信箱</h3>
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
            <h3>密碼</h3>
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
          <div className="error-text">{this.state.error || ""}</div>
          <div>
            <div className="btn-group">
              <button
                onClick={this.handleLogin}
                className="btn-style-round">
                登入
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
