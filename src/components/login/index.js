import React from "react";
import PropTypes from "prop-types";
import {Redirect} from "react-router-dom";
import Database from "../../firebase";
import "../../style/signup.scss";
import "../../style/btn.scss";
import "../../style/checkbox.scss";
import Header from "../header";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      redirect: false
    };
    this.redirectToLobbyIfLogin();

    ["redirectToLobbyIfLogin", "handleLogin"].forEach(name => {
      this[name] = this[name].bind(this);
    });
  }
  redirectToLobbyIfLogin() {
    Database.getCurrentUser()
      .then(user => {
        if (user) {
          this.setState({redirect: true});
          return user;
        } else {
          throw new Error("NO CURRENT USER");
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  handleLogin() {
    let {email, password} = this.state;
    if (!email || !password) return;
    Database.signInWithEmailAndPassword(this.state)
      .then(user => {
        this.setState({redirect: true});
      })
      .catch(error => {
        this.setState({error: error && error.message});
      });
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <Header
          isHeaderPanelClosed={this.props.isHeaderPanelClosed}
          getUserAuthInfo={this.props.getUserAuthInfo}
          currentUser={this.props.currentUser}
        />
        <div className="singup-wrapper">
          <div className="signup login">
            <h2>Login</h2>
            <div>
              <h3>Email</h3>
              <input
                type="text"
                placeholder="Email address"
                onChange={e => {
                  this.setState({
                    email: e.currentTarget.value
                  });
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
            <div className="error-text">
              {this.state.error || ""}
            </div>
            <div>
              <div className="btn-group">
                <button
                  onClick={this.handleLogin}
                  className="btn-style-round">
                  Log in
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
