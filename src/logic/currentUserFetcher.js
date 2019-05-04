import AnonymousUser from "./anonymousUser.js";
import {dispatch} from "../reducer";
import Database from "../firebase";

export default class CurrentUserFetcher {
  constructor(user) {
    this.user = user;
    this.isExist = !!this.user;
    this.isAnonymous = this.user && this.user.isAnonymous;
    this.isSignUp = this.user && !this.user.isAnonymous;
  }
  fetchAnonymousUserIfExist() {
    return JSON.parse(window.sessionStorage.getItem("anonymousUser"));
  }
  clear() {
    window.sessionStorage.removeItem("anonymousUser");
    Database.auth.signOut();
    this.dispatch(null);
  }
  dispatch(user = this.user) {
    dispatch("UPDATE_USER_INFO", {
      user: user,
      displayName: (user && user.displayName) || null
    });
  }
  loadUser() {
    if (!this.isExist) {
      Database.onAuthChanged(user => {
        if (user) {
          this.dispatch(user);
        }
      });
      let anonymousUser = this.fetchAnonymousUserIfExist();
      this.dispatch(anonymousUser);
    }
  }
  loginAsAnonymousIfNeed() {
    if (this.isExist || this.isAnonymous) return;
    this.user = new AnonymousUser();
    this.user.saveToSession();
    this.dispatch();
  }
}
