import AnonymousUser from "./anonymousUser.js";
import {dispatch} from "../reducer";
import Database from "../firebase";

export default class CurrentUserFetcher {
  constructor(user) {
    this.user = user;
    this.isExist = !!this.user;
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
  setCurrentUser(user) {
    this.user = user;
    this.isExist = !!this.user;
  }
  loadUser() {
    if (this.user) return;
    return Database.getAuth()
      .then(user => {
        if (user) {
          this.dispatch(user);
          this.setCurrentUser(user);
          return user;
        }
      })
      .catch(nonUser => {
        let anonymousUser = this.fetchAnonymousUserIfExist();
        this.setCurrentUser(anonymousUser);
        this.dispatch(anonymousUser);
        return anonymousUser;
      });
  }
  loginAsAnonymousIfNeed() {
    if (this.isExist || (this.user && this.user.isAnonymous))
      return this.user;
    let anonymousUser = new AnonymousUser();
    this.setCurrentUser(anonymousUser);
    this.user.saveToSession();
    this.dispatch(anonymousUser);
    return anonymousUser;
  }
}
