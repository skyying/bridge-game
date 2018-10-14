import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {app} from "../firebase/firebase.js";
import "../style/signup.scss";
import "../style/btn.scss";
import "../style/checkbox.scss";
import {Redirect} from "react-router-dom";
import {dispatchToDatabase} from "../reducer/reducer.js";

const error = {
  "no-error": ""
};

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
    let auth = app.auth;
    let {email, password, name} = this.state;
    if (!email || !password || !confirm) return;
    let promise = auth.createUserWithEmailAndPassword(email, password);
    promise
      .then(user => {
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
            app.getDataByPathOnce(`users/${user.uid}`, snapshot => {
              if (!snapshot.val()) {
                dispatchToDatabase("CREATE_USER", {
                  uid: user.uid,
                  userInfo: userInfo
                });
              }
            });
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
      <div className="singup-wrapper">
        <div className="signup">
          <h2>Sign up</h2>
          <div>
            <h3>User name</h3>
            <input
              placeholder="Your name"
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
              placeholder="New password"
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
            <h3>Confirm password</h3>
            <input
              placeholder="Confirm new password"
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
              placeholder="Email address"
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
            <label className="checkbox-lable">
              <input id="agreement" type="checkbox" />
              <div
                className={
                  this.state.agreement ? "checked" : ""
                }
                onClick={() =>
                  this.setState({
                    agreement: !this.state.agreement
                  })
                }
              />
              <span
                onClick={() =>
                  this.setState({
                    agreement: !this.state.agreement
                  })
                }>
                                I allow the use of collected data about my study
                                behavior for research purposes. The data
                                contains information from game playing and chatting
                                messages. No individuals can be identified from
                                publications.
              </span>
            </label>
            <div className="error-text error-text-panel">
              {this.state.message}
            </div>
            <div className="btn-group">
              <button
                onClick={this.handleSignUp}
                className="btn-style-round">
                                Sign up
              </button>
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
