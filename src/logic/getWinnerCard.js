import {NO_TRUMP, TOTAL_TRICKS} from "../components/constant";
import {getCurrentMaxTrick} from "./getCurrentMaxTrick.js";

// which card has max value by the bid trump
const findMaxValueByTrump = (arr, trump) => {
  if (!arr || trump === null || trump === undefined) {
    return;
  }
  let list = arr
    .filter(item => Math.floor(item.value / TOTAL_TRICKS) === trump)
    .sort((cardA, cardB) => cardB.value - cardA.value);
  return list.length ? list[0] : null;
};

// handle winner card logic
// if there are any cards with same rank as trump, compare their face value
// else follow first card's rank to compare value;
export const getWinnerCard = (game, cardValue) => {
  if (!game) return;
  let cards = game.cards,
    maxTrick = getCurrentMaxTrick(cards);

  let {trump} = game.bid;
  let cardsMatchCurrentTrick = cards
    .map((card, index) => Object.assign({}, card, {index: index}))
    .filter(
      card =>
        (card.trick === maxTrick && card.trick > 0) ||
                card.value === cardValue
    );
  let winnerCard,
    noTrumpCards = false;

  if (cardsMatchCurrentTrick.length === 4) {
    // which card is first been played
    let first = Math.min(...cardsMatchCurrentTrick.map(card => card.order));
    let [firstHand] = cardsMatchCurrentTrick.filter(
      card => card.order === first
    );
    // trump matters most, else, decide by what first hand has draw
    if (trump !== NO_TRUMP) {
      // filter trump cards, and compare their face value
      let tmp = findMaxValueByTrump(cardsMatchCurrentTrick, trump);

      if (tmp !== null) {
        winnerCard = tmp;
      } else {
        noTrumpCards = true;
      }
    }

    if (trump === NO_TRUMP || noTrumpCards) {
      // if their quotient are the same, compare their value, else, let first win
      let trumpRef = Math.floor(firstHand.value / TOTAL_TRICKS);
      winnerCard = findMaxValueByTrump(cardsMatchCurrentTrick, trumpRef);
    } // end of no trump
  }

  return winnerCard || null;
};
