import {
  PLAYER_NUM,
  CARD_NUM,
  EMPTY_SEAT,
  NO_TRUMP,
  DEFAULT_GAME
} from "./constant.js";

export const hasSameSuitWithFirstCard = (firstCard, cards) => {
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

export const getOffsetDatabyCurrentUser = (game, currentUser) => {
  if (!game || !game.cards) return;

  let {cards, players} = game;

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
  let flat = dislayList.flat();
  let len = flat.length;
  if (Math.floor(len / 3) < 1 && len > 1) {
    let mid = Math.floor(len / 2);
    return [flat.slice(0, mid), flat.slice(mid, len)];
  } else if (Math.floor(len / 3) > 1) {
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
