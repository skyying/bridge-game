import {getCurrentMaxTrick} from "../src/logic/getCurrentMaxTrick.js";
import {testData} from "./testData/testData.js";

describe("getCurrentMaxTrick, should output correct maxtrick result", () => {
  it("should outupt correct current max trick", () => {
    expect(getCurrentMaxTrick(testData.tables["ongoing"].game.cards)).toBe(6);
  });
  it("should outupt correct current max trick", () => {
    expect(getCurrentMaxTrick(testData.tables["gameover"].game.cards)).toBe(13);
  });
  it("should outupt null if no cards", () => {
    expect(getCurrentMaxTrick(null)).toBe(null);
  });
});
