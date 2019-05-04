import AnonymousUser from "../src/logic/anonymousUser.js";

describe("AnonymousPlayer, should create correct anonymous player", () => {
  let anonymousUser = new AnonymousUser();

  it("should have correct uid", () => {
    expect(anonymousUser.uid.length).toBeGreaterThan(0);
  });

  it("should have correct displayName", () => {
    expect(anonymousUser.displayName.length).toBeGreaterThan(0);
  });

  it("should have correct displayName in user Info", () => {
    expect(anonymousUser.userInfo.displayName).toBe(
      anonymousUser.displayName
    );
  });

  it("should have correct user type", () => {
    expect(anonymousUser.isAnonymousUser).toBeTruthy();
  });
});
