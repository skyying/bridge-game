import TeamScore from "../src/logic/teamscore.js";
import {testData} from "./testData/testData.js";
import {RESULT} from "../src/components/constant";

describe("teamscore, current user is a player, when game is ongoing", () => {
  const currentUser = {};
  currentUser.uid = "bill";
  const table = testData.tables["table2"];
  const score = new TeamScore(table, currentUser);
  it("should outupt correct player index base on current user uid", () => {
    expect(score.getPlayerIndex(currentUser.uid)).toBe(1);
  });
  it("should output correct team score by default player list", () => {
    expect(score.getDefaultScore(table.game)).toEqual({
      teamOne: 0,
      teamTwo: 5
    });
  });
  it("should output correct team score by current user's team", () => {
    expect(score.getScore(table.game)).toEqual({
      teamOne: 5,
      teamTwo: 0
    });
  });
  it("should output correct targetTrick", () => {
    expect(score.targetTrick).toBe(7);
  });
  it("should output correct bool value of is current user a player", () => {
    expect(score.isCurrentUserAPlayer).toBe(true);
  });

  it("should output correct declarer", () => {
    expect(score.declarer).toBe(0);
  });
});

describe("teamscore, currnet user is a player, and game is over ", () => {
  const currentUser = {};
  currentUser.uid = "nz";
  const table = testData.tables["table1"];
  const score = new TeamScore(table, currentUser);

  it("should outupt correct player index base on current user uid", () => {
    expect(score.getPlayerIndex(currentUser.uid)).toBe(1);
  });

  it("should output correct team score by default player list", () => {
    expect(score.getDefaultScore(table.game)).toEqual({
      teamOne: 3,
      teamTwo: 10
    });
  });

  it("should output correct team score by current user's team", () => {
    expect(score.getScore(table.game)).toEqual({
      teamOne: 10,
      teamTwo: 3
    });
  });

  it("should output correct targetTrick", () => {
    expect(score.targetTrick).toBe(7);
  });

  it("should output correct bool value of is current user a player", () => {
    expect(score.isCurrentUserAPlayer).toBe(true);
  });

  it("should output correct declarer", () => {
    expect(score.declarer).toBe(1);
  });

  it("should output correct game result message", () => {
    expect(score.getResult(table.game)).toEqual({
      isUserWin: true,
      resultWords: "YOU WIN"
    });
  });
});

describe("teamscore, if current user is not a player", () => {
  const currentUser = {};
  currentUser.uid = "1";
  const table = testData.tables["table1"];
  const score = new TeamScore(table, currentUser);

  it("should outupt correct player index base on current user uid", () => {
    // default is 0
    expect(score.getPlayerIndex(currentUser.uid)).toBe(-1);
  });

  it("should output correct team score by default player list", () => {
    expect(score.getDefaultScore(table.game)).toEqual({
      teamOne: 3,
      teamTwo: 10
    });
  });

  it("should output correct team score by current user's team", () => {
    expect(score.getScore(table.game)).toEqual({
      teamOne: 3,
      teamTwo: 10
    });
  });

  it("should output correct targetTrick", () => {
    expect(score.targetTrick).toBe(7);
  });

  it("should output correct bool value of is current user a player", () => {
    expect(score.isCurrentUserAPlayer).toBe(false);
  });

  it("should output correct declarer", () => {
    expect(score.declarer).toBe(1);
  });

  it("should output correct game result message", () => {
    expect(score.getResult(table.game)).toEqual({
      isUserWin: false,
      resultWords: ""
    });
  });
});
