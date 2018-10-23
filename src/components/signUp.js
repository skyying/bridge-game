import React from "react";
import PropTypes from "prop-types";
import {DB} from "../firebase/db.js";
import "../style/signup.scss";
import "../style/btn.scss";
import "../style/checkbox.scss";
import {Redirect} from "react-router-dom";
import {dispatchToDatabase} from "../reducer/reducer.js";
import Header from "./header.js";

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
    let auth = DB.auth;
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
            DB.getDataByPathOnce(`users/${user.uid}`, snapshot => {
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
      <div>
        <Header
          getUserAuthInfo={this.props.getUserAuthInfo}
          currentUser={this.props.currentUser}
        />
        <div className="singup-wrapper">
          <div className="signup">
            <h2>註冊</h2>
            <div>
              <h3>玩家名稱</h3>
              <input
                placeholder="請輸入玩家名稱"
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
              <h3>密碼</h3>
              <input
                placeholder="請輸入至少 6 位數"
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
              <h3>確認密碼</h3>
              <input
                placeholder="請輸入至少 6 位數"
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
              <h3>電子信箱</h3>
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
                                    註冊
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// <label className="checkbox-lable">
//   <input id="agreement" type="checkbox" />
//   <div
//     className={
//       this.state.agreement ? "checked" : ""
//     }
//     onClick={() =>
//       this.setState({
//         agreement: !this.state.agreement
//       })
//     }
//   />
// </label>

// <span
//   onClick={() =>
//     this.setState({
//       agreement: !this.state.agreement
//     })
//   }>
//                   I allow the use of collected data about my study
//                   behavior for research purposes. The data
//                   contains information from game playing and
//                   chatting messages. No individuals can be
//                   identified from publications.
// </span>
