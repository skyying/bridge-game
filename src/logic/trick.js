/*
 * A trick class is to return how many tricks has been played so far
 * which card is the first card of current trick
 * @param 
 * return 
 */

export default class TrickLogic {
  constructor() {
    this.TOTAL_CARDS_OF_EACH_TRICK = 4;
  }
  // return first card of current trick in current game
  getFirstCardOfCurrentTrick(game) {
    if (!this.validateProps(game)) {
      return null;
    }
    let {cards} = game;

    let currentTrickCount = this.getNextTrickCount(game);
    return (
      cards.find(
        card =>
          Math.floor(card.order / this.TOTAL_CARDS_OF_EACH_TRICK) +
                        1 ===
                        currentTrickCount &&
                    card.order % this.TOTAL_CARDS_OF_EACH_TRICK === 0
      ) || null
    );
  }
  // return how many trick is played so far
  getCurrentTrickCount(game) {
    if (!this.validateProps(game)) {
      return null;
    }
    let {cards} = game;
    return Math.max(...cards.map(card => card.trick));
  }
  // next trick number in current game
  getNextTrickCount(game) {
    if (!this.validateProps(game)) {
      return null;
    }
    let {cards} = game;
    let currentTrickCount = this.getCurrentTrickCount(game),
      maxTrickNum = cards.filter(card => card.trick === currentTrickCount)
        .length;
    if (
      currentTrickCount === 0 ||
            maxTrickNum === this.TOTAL_CARDS_OF_EACH_TRICK
    ) {
      return currentTrickCount + 1;
    }
    return currentTrickCount;
  }
  // validate if next game exists?
  validateProps(game) {
    if (!game || !game.cards) {
      return null;
    }
    return game;
  }
}
