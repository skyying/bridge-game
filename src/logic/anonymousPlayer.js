export default class AnonymousPlayer {
  constructor() {
    this.userInfo = {
      displayName: this.getDisplayName()
    };
    this.displayName = this.userInfo.displayName;
    this.isAnonymousUser = true;
    this.uid = this.genUID();
  }
  genUID() {
    let UID_LENGTH = 50;
    let uid = "";
    while (uid.length < UID_LENGTH) {
      uid += Math.random()
        .toString(36)
        .substr(2, 28);
    }
    return uid.slice(0, UID_LENGTH);
  }
  getDisplayName() {
    return (
      Math.random()
        .toString(36)
        .substr(2, 2) +
            Math.floor(Math.random() * 10) +
            1
    );
  }
}
