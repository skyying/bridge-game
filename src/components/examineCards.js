import {TOTAL_TRICKS} from "./constant.js";

export const hasSameSuitWithFirstCard = (firstCard, cards) => {
  if (!cards) {
    return false;
  }
  return (
    firstCard &&
        cards.filter(card => {
          return (
            Math.floor(card.value / TOTAL_TRICKS) ===
                Math.floor(firstCard.value / TOTAL_TRICKS)
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
