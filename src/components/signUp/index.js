import React from "react";
import PropTypes from "prop-types";
import Database from "../../firebase";
import "../../style/signup.scss";
import "../../style/btn.scss";
import "../../style/checkbox.scss";
import {Redirect} from "react-router-dom";
import {dispatchToDatabase} from "../../reducer";
import Header from "../header";

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      confirm: "",
      agreement: false,
      message: "",
      redirect: false
    };
    this.handleSignUp = this.handleSignUp.bind(this);
  }
  handleSignUp() {
    let auth = Database.auth;
    let {email, password, name} = this.state;
    if (!email || !password || !confirm) return;
    let promise = auth.createUserWithEmailAndPassword(email, password);
    promise
      .then(user => {
        let randomIcon = Math.floor(Math.random() * 20);
        this.props.updateUserInfo(user, {
          name: name,
          email: email
        });
        return auth.onAuthStateChanged(user => {
          if (user) {
            let userInfo = {
              displayName: name,
              email: email
            };
            user.updateProfile(userInfo);
            Database.getDataByPathOnce(
              `users/${user.uid}`,
              snapshot => {
                if (!snapshot.val()) {
                  dispatchToDatabase("CREATE_USER", {
                    uid: user.uid,
                    userInfo: userInfo
                  });
                }
              }
            );
          } else {
            console.log("no user uid");
          }
        });
      })
      .then(user => this.setState({redirect: true}))
      .catch(error => this.setState({message: error.message}));
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }

    return (
      <div>
        <Header
          isHeaderPanelClosed={this.props.isHeaderPanelClosed}
          currentUser={this.props.currentUser}
        />
        <div className="singup-wrapper">
          <div className="signup">
            <h2>Sign up</h2>
            <div>
              <h3>Name</h3>
              <input
                placeholder="Player name"
                type="text"
                onChange={e => {
                  this.setState({
                    name: e.currentTarget.value,
                    message: ""
                  });
                }}
                value={this.state.name}
              />
            </div>
            <div>
              <h3>Password</h3>
              <input
                placeholder="Minimum 6 characters is required"
                type="password"
                onChange={e => {
                  this.setState({
                    password: e.currentTarget.value,
                    message: ""
                  });
                }}
                value={this.state.password}
              />
            </div>
            <div>
              <h3>Confirm</h3>
              <input
                placeholder="Minimum 6 characters is required"
                type="password"
                onChange={e => {
                  this.setState({
                    confirm: e.currentTarget.value,
                    message: ""
                  });
                }}
                value={this.state.confirm}
              />
            </div>
            <div>
              <h3>Email</h3>
              <input
                type="email"
                placeholder="john@bridge.com"
                onChange={e => {
                  this.setState({
                    email: e.currentTarget.value,
                    message: ""
                  });
                }}
                value={this.state.email}
              />
            </div>
            <div>
              <div className="error-text error-text-panel">
                {this.state.message}
              </div>
              <div className="btn-group">
                <button
                  onClick={this.handleSignUp}
                  className="btn-style-round">
                                    Sign up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
