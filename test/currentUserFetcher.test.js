import CurrentUserFetcher from "../src/logic/currentUserFetcher.js";
import AnonymousUser from "../src/logic/anonymousUser.js";


describe("currentUserFetcher, should get correct current user", () => {
  let user = {
    userInfo: {displayName: "abc"},
    uid: "abc_uid",
    displayName: "abc"
  };

  let newAnonymouseUser = new AnonymousUser();
  let noUser = null;

  let currentUser = new CurrentUserFetcher(noUser);
  let signUpUser = new CurrentUserFetcher(user);
  let anonymousUser = new CurrentUserFetcher(newAnonymouseUser);
  it("should return null user object if no user", () => {
    expect(currentUser.user).toBeNull();
  });

  it("should return null user object if has nomral user", () => {
    expect(signUpUser.user).toBe(user);
  });

  it("should return null user object if has anonymouse user", () => {
    expect(anonymousUser.user).toBe(newAnonymouseUser);
  });

  it("should have anonymous user", () => {
    currentUser.loginAsAnonymousIfNeed();
    expect(currentUser.user.isAnonymous).toBeTruthy();
    expect(currentUser.isExist).toBeTruthy();
    expect(currentUser.user.uid.length).toBe(50);
  });

  it("should not create new anonymousUser", () => {
    let UID = anonymousUser.user.uid;
    anonymousUser.loginAsAnonymousIfNeed();
    expect(anonymousUser.user.uid).toBe(UID);

    let newUID = signUpUser.user.uid;
    signUpUser.loginAsAnonymousIfNeed();
    expect(signUpUser.user.uid).toBe(newUID);
  });
});
