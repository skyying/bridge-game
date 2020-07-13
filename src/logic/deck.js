import {getRandomInt} from "../helper";
import {CARD_NUM} from "../components/constant";
import {TOTAL_TRICKS} from '../components/constant/constant.ts'

/*
 * A Deck class can generate random cards with all four hands has validate card face-value
 */
export default class Deck {
  constructor() {
    this.cards = this.shuffle();
  }
  shuffle() {
    let cards = this.getRandomCards();
    while (!this.validateShuffle(cards)) {
      cards = this.getRandomCards();
    }
    return cards.map(facevalue => ({value: facevalue, trick: 0}));
  }
  // get a random array with not-repeated 0-51 digit in it
  getRandomCards() {
    let cards = Array.from({length: CARD_NUM.TOTAL})
      .fill(0)
      .map((card, i) => i);

    // shuffle array algorithm
    for (let i = cards.length - 1; i > 0; i--) {
      let randomIndex = getRandomInt(0, CARD_NUM.TOTAL - 1);

      [cards[i], cards[randomIndex]] = [cards[randomIndex], cards[i]];
    }

    return cards;
  }
  // split random array to 4 sub arrays
  deal(cards) {
    return [0, 0, 0, 0]
      .map((userIndex, index) => {
        return cards.filter((card, i) => i % 4 === index);
      })
      .slice(0);
  }
  // J=1, Q=2, K=3, A=4 points;
  // check if those sub array has at least 7 points
  validateShuffle(cards) {
    const TOTAL_CARD_VALUE = 8;
    return this.deal(cards)
      .map(hand =>
        hand.map(
          value =>
            value % TOTAL_TRICKS > TOTAL_CARD_VALUE
              ? (value % TOTAL_TRICKS) - TOTAL_CARD_VALUE
              : 0
        )
      )
      .every(
        hand =>
          hand.reduce((sum, value) => value + sum, 0) >=
                    TOTAL_CARD_VALUE - 1
      );
  }
}
