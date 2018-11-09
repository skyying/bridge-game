import TrickLogic from "../src/logic/trick.js";
import {testData} from "./testData/testData.js";

describe("TrickLogic, should output correct information of current trick", () => {
  let currentTrick = new TrickLogic();
  let game = testData.tables["gameover"].game;

  it("should outupt null if no game, or game.cards", () => {
    expect(currentTrick.validateProps(null)).toEqual(null);
  });
  it("should outupt game if has game", () => {
    expect(currentTrick.validateProps(game)).toEqual(game);
  });
  it("should outupt correct first card of current trick", () => {
    expect(currentTrick.getFirstCardOfCurrentTrick(game)).toEqual(null);
  });
});

describe("TrickLogic, should output first card of correct trick", () => {
  let currentTrick = new TrickLogic();
  let firstGame = testData.tables["ongoing"].game;
  let secondGame = testData.tables["ongoing_trick_5_end"].game;
  let thirdGame = testData.tables["gameover"].game;
  it("if only first card, should get correct first card", () => {
    expect(currentTrick.getFirstCardOfCurrentTrick(firstGame)).toEqual({
      order: 20,
      player: 3,
      trick: 6,
      value: 37
    });
  });
  it("if all players played their cards in current trick, should show no first card", () => {
    expect(currentTrick.getFirstCardOfCurrentTrick(secondGame)).toEqual(
      null
    );
  });
  it("should get correct result of how many tricks has been played", () => {
    expect(currentTrick.getCurrentTrickCount(firstGame)).toBe(6);
  });
  it("should get correct result of how many tricks has been played", () => {
    expect(currentTrick.getCurrentTrickCount(secondGame)).toEqual(5);
  });
  it("should get correct result of how many tricks has been played", () => {
    expect(currentTrick.getCurrentTrickCount(thirdGame)).toBe(13);
  });
  it("should get correct result of how many tricks has been played", () => {
    expect(currentTrick.getNextTrickCount(firstGame)).toBe(6);
  });
  it("should get correct result of how many tricks has been played", () => {
    expect(currentTrick.getNextTrickCount(secondGame)).toBe(6);
  });
  it("should get correct result of how many tricks has been played", () => {
    expect(currentTrick.getNextTrickCount(thirdGame)).toBe(14);
  });
});


