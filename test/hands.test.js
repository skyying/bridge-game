import Hands from "../src/logic/hands.js";
import {testData} from "./testData/testData.js";

describe("hands, current user as player", () => {
  let table = testData.tables["ongoing"];
  // first user in player list
  let user = {uid: "nz", displayName: "nz"};

  let hands = new Hands(table, user);

  it("should outupt correct declarer index", () => {
    expect(hands.declarerIndex).toBe(0);
  });
  it("should outupt correct result of is current user a player", () => {
    expect(hands.isCurrentUserAPlayer).toBe(true);
  });
  it("should outupt correct current turn player", () => {
    expect(hands.currentTurnPlayer).toBe(table.players[table.game.deal]);
  });
  it("should outupt correct dummy index", () => {
    expect(hands.dummyIndex).toBe(2);
  });
  it("should outupt correct dummy index", () => {
    expect(hands.dummyIndex).toBe(2);
  });
});

describe("test of hands, second player", () => {
  let table = testData.tables["ongoing"];
  // first user in player list
  let user = {uid: "bill", displayName: "bill"};

  let hands = new Hands(table, user);

  it("should outupt correct declarer index", () => {
    expect(hands.declarerIndex).toBe(0);
  });
});

describe("test of hands, viewer", () => {
  let table = testData.tables["ongoing"];
  // first user in player list
  let user = {uid: "leslie", displayName: "leslie"};

  let hands = new Hands(table, user);

  it("should outupt correct declarer index", () => {
    expect(hands.declarerIndex).toBe(0);
  });

  it("should outupt correct result of is current user a player", () => {
    expect(hands.isCurrentUserAPlayer).toBe(false);
  });
});
