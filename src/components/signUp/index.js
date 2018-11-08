import React from "react";
import PropTypes from "prop-types";
import Database from "../../firebase";
import {Redirect} from "react-router-dom";
import {dispatch, dispatchToDatabase} from "../../reducer";
import Header from "../header";
import "../../style/signup.scss";
import "../../style/btn.scss";
import "../../style/checkbox.scss";

/*
 * A Sign up page Component, take user sign up info and send to firebase sign up 
 */
export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    // user sign up form
    this.state = {
      name: "",
      email: "",
      password: "",
      confirm: "",
      // error message
      message: "",
      // redirect to lobby if sign up successfully
      canRedirect: false
    };
    this.handleSignUp = this.handleSignUp.bind(this);
  }
  handleSignUp() {
    let singUp = Database.signUp;
    let {email, password, name} = this.state;
    const pushToDB = user => {
      let userInfo = {name: user.displayName, email: user.email};
      dispatchToDatabase("CREATE_USER", {
        uid: user.uid,
        userInfo: userInfo
      });
    };

    singUp(email, password, name, pushToDB)
      .then(user => {
        dispatch("UPDATE_USER_INFO", {
          user: user
        });
      })
      .then(user => this.setState({canRedirect: true}))
      .catch(error => this.setState({message: error.message}));
  }
  render() {
    if (this.state.canRedirect) {
      return (
        <Redirect
          to={{
            pathname: "/",
            state: this.state
          }}
        />
      );
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

SignUp.propTypes = {
  isHeaderPanelClosed: PropTypes.bool,
  currentUser: PropTypes.any
};
