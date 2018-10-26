import {
  PLAYER_NUM,
  CARD_NUM,
  EMPTY_SEAT,
  NO_TRUMP,
  DEFAULT_GAME
} from "./constant.js";
import {getRandomInt} from "../helper/helper.js";

export const hasSameSuitWithFirstCard = (firstCard, cards) => {
  if (!cards) {
    return false;
  }
  return (
    firstCard &&
        cards.filter(card => {
          return (
            Math.floor(card.value / CARD_NUM.HAND) ===
                Math.floor(firstCard.value / CARD_NUM.HAND)
          );
        }).length > 0
  );
};

// get porker card detail information offset by current login user
export const getOffsetDatabyCurrentUser = (players, game, currentUser) => {
  if (!game || !game.cards) return;

  let {cards} = game;

  // default don't offset
  let cardsByPlayer = players
    .map((userIndex, index) => {
      return cards.filter((card, i) => i % players.length === index);
    })
    .slice(0);

  let offsetIndex = players.findIndex(user => user === currentUser);

  let isCurrentUserAPlayer = offsetIndex !== -1;

  // user is curretn user
  if (isCurrentUserAPlayer) {
    return {
      cardsByPlayer: [
        ...cardsByPlayer.slice(offsetIndex),
        ...cardsByPlayer.slice(0, offsetIndex)
      ],
      offsetPlayers: [
        ...players.slice(offsetIndex),
        ...players.slice(0, offsetIndex)
      ],
      offsetIndex: offsetIndex
    };
  }

  return {
    cardsByPlayer: cardsByPlayer,
    offsetPlayers: players.slice(0),
    offsetIndex: offsetIndex
  };
};

export const mapFlipDownCards = dislayList => {
  if (!dislayList) return;
  let flat = dislayList.flat();
  let cardsNumberOnHand = 5;
  let totalLen = flat.length;
  // if cards number is under n, split flipdown card into two row;
  if (totalLen <= cardsNumberOnHand) {
    let mid = Math.floor(totalLen / 2);
    return [flat.slice(0, mid), flat.slice(mid, totalLen)];
  } else {
    let threeRow = [[], [], []];
    flat.map((card, index) => threeRow[index % 3].push(card));
    return threeRow;
  }
};

export const getFirstCard = game => {
  if (!game) {
    return null;
  }
  // what is the first card of current trick
  // in order to let players only can draw card as the same suit
  if (
    game.cards &&
        game.cards.length >= PLAYER_NUM &&
        game.order % PLAYER_NUM !== PLAYER_NUM - 1
  ) {
    return game.cards
      .filter(card => card.order % PLAYER_NUM === 0)
      .sort((cardA, cardB) => cardB.order - cardA.order)[0];
  }
  return null;
};

export const shuffleCards = () => {
  let cards = getRandomCards();
  while (!validateShuffle(cards)) {
    cards = getRandomCards();
  }
  return cards;
};

// split all cards to four hands
export const mapToFourHands = cards => {
  if (!cards) return;
  return [0, 0, 0, 0]
    .map((userIndex, index) => {
      return cards.filter((card, i) => i % 4 === index);
    })
    .slice(0);
};


// filter only JQKA
export const fourHands = cards => {
  return mapToFourHands(cards).map(hand =>
    hand.map(value => (value % 13 > 8 ? (value % 13) - 8 : 0))
  );
};


const getRandomCards = () => {
  let cards = Array.from({length: CARD_NUM.TOTAL})
    .fill(0)
    .map((card, i) => i);

  // shuffle array algorithm
  for (let i = cards.length - 1; i > 0; i--) {
    let randomIndex = getRandomInt(0, CARD_NUM.TOTAL - 1);
    [cards[i], cards[randomIndex]] = [cards[randomIndex], cards[i]];
  }

  return cards;
};


// check if all hands are valid, at least have 7 points;
// A: 4 points, K: 3 points, Q: 2points, J: 1 points
const validateShuffle = cards => {
  return fourHands(cards).every(
    hand => hand.reduce((sum, value) => value + sum, 0) >= 7
  );
};

export const getMaxCardNumPerSuit = cardsForPlayerHand => {
  return Math.max(...cardsForPlayerHand.map(suit => suit.length));
};

export const getHandPosByCardNum = (cardsForPlayerHand, cardSize, offset) => {
  let maxCardNum = getMaxCardNumPerSuit(cardsForPlayerHand);
  if (maxCardNum === 0) {
    return 0;
  }
  return (maxCardNum - 1) * offset + cardSize;
};
