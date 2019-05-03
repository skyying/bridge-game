import AnonymousPlayer from "../src/logic/anonymousPlayer.js";

describe("AnonymousPlayer, should create correct anonymous player", () => {
  let anonymousPlayer = new AnonymousPlayer();

  it("should have correct uid", () => {
    expect(anonymousPlayer.uid.length).toBeGreaterThan(0);
  });

  it("should have correct displayName", () => {
    expect(anonymousPlayer.displayName.length).toBeGreaterThan(0);
  });

  it("should have correct displayName in user Info", () => {
    expect(anonymousPlayer.userInfo.displayName).toBe(
      anonymousPlayer.displayName
    );
  });

  it("should have correct user type", () => {
    expect(anonymousPlayer.isAnonymousUser).toBeTruthy();
  });
});
