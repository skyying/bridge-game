export default class TrickLogic {
  constructor() {
    this.TOTAL_CARDS_OF_EACH_TRICK = 4;
  }
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
  getCurrentTrickCount(game) {
    if (!this.validateProps(game)) {
      return null;
    }
    let {cards} = game;
    return Math.max(...cards.map(card => card.trick));
  }
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
  validateProps(game) {
    if (!game || !game.cards) {
      return null;
    }
    return game;
  }
}
