const CONST = require("./constant.js");
const CardsSet = require("./cards.js");
const Db = require("./db.js");

exports.deal = function(table) {

    if (!table) {
        console.log("no table data in GAME deal");
        return null;
    }

    let updateGame = Object.assign({}, table.game);
    let bestGuess = module.exports.guess(table);
  console.log("bestGuess", bestGuess);
    delete bestGuess.diff;
    let order = Number(table.game.order) + 1;

    updateGame.order = order;
    bestGuess.player = table.game.deal;
    bestGuess.order = order;
    bestGuess.trick = module.exports.nextTrick(updateGame.cards.slice(0));

    let tagetIndex = table.game.cards.findIndex(
        card => card.value === bestGuess.value
    );

    updateGame.cards[tagetIndex] = bestGuess;
    updateGame.deal = (table.game.deal + 1) % 4;
    // getWinner got wrong cards, the card order didn't udpate

    let winnerCard = module.exports.getWinner(
        Object.assign({}, updateGame),
        bestGuess.value
    );

    if (order === 51) {
        updateGame.isGameOver = true;
    }
    if (winnerCard) {
        //todo, update winner
        winnerCard.isWin = true;
        updateGame.deal = winnerCard.player;
        let winningCardIndex = updateGame.cards.findIndex(
            card => card.value === winnerCard.value
        );
        updateGame.cards[winningCardIndex] = winnerCard;
    }
    let updateTable = Object.assign(
        {},
        table,
        {gameState: order === 51 ? "gameover" : "playing"},
        {game: updateGame},
        {timeStamp: new Date().getTime()}
    );
    console.log("Best Guess:", bestGuess);
    Db.setTableDataById(updateTable);
    console.log("in game.deal---end");
};


exports.guess = function(table) {
    // let {game, players} = table;
    let game = table.game;

    let players = table.players;
    let cards = table.game.cards;
    let getFirstCard = module.exports.firstCard(cards, game.order);
    let checkIfCardTrump = module.exports.isCurrentCardTrump;
    let currentHand = module.exports.cardsByPlayer(players, cards);
    let currentTrickCards = module.exports.trickCard(cards);
    let isSameTeam = module.exports.sameTeam;

    currentHand = currentHand[game.deal];

    let allTrumpCard = currentHand
        .filter(card => checkIfCardTrump(card, game.bid.trump))
        .sort((a, b) => a.value - b.value);

    let bestTrumpCard = allTrumpCard[0];

    let currentPlayerhasTrumpCards = allTrumpCard.length > 0;

    let currentTrumpWinnerCard, currentWinnerCard, isCurrentWinnerCardATrump;

    if (getFirstCard) {
        currentTrumpWinnerCard =
            currentTrickCards
                .filter(card => checkIfCardTrump(card, game.bid.trump))
                .sort((cardA, cardB) => cardB.value - cardA.value)[0] || null;

        // if any card in current trick is trump and winner, or the highest face vaule
        // card of current trick;
        currentWinnerCard =
            currentTrumpWinnerCard ||
            (currentTrickCards.length === 1
                ? currentTrickCards[0]
                : currentTrickCards
                      .filter(
                          card =>
                              Math.floor(card.value / 13) ===
                              Math.floor(getFirstCard.value / 13)
                      )
                      .sort((cardA, cardB) => cardB.value - cardA.value)[0] ||
                  null);

        isCurrentWinnerCardATrump = checkIfCardTrump(
            currentWinnerCard,
            game.bid.trump
        );
    }

    // cards are dealed by enemys
    // let enemyCardsOnTrick = currentTrickCards.filter(
    //     card => card.player % 2 !== game.deal % 2,
    // );

    let cardsForFirstDraw = currentHand.sort(
        (cardA, cardB) => (cardB.value % 13) - (cardA.value % 13)
    );

    //  when no first cards, deal with first card
    if (!currentTrickCards.length || !getFirstCard) {
        return cardsForFirstDraw[0];
    } else {
        // chech has which availiabe cards at the same rank;
        let sameRankCards = module.exports.followFirstCard(
            currentHand,
            getFirstCard
        );

        if (sameRankCards.length === 1) {
            return sameRankCards[0];

            // has more than one same rank cards
        } else if (sameRankCards.length > 1 && currentWinnerCard) {
            // lost strategy, if your partner win, or if enemey has send
            // trump card
            if (
                // partner win
                isSameTeam(currentWinnerCard, game.deal) ||
                // enemy has trump and you have same rank card
                (!isSameTeam(currentWinnerCard, game.deal) &&
                    checkIfCardTrump(currentWinnerCard, game.bid.trump)) ||
                // enemy has win, and your cards can't beat winner
                (!isSameTeam(currentWinnerCard, game.deal) &&
                    sameRankCards[0].value < currentWinnerCard.value)
            ) {
                // lose strategy
                return sameRankCards[sameRankCards.length - 1];
            } else {
                // winner stratgy, find most possible answer
                // let diff = 52;
                let bestShotList = sameRankCards.filter(
                    card => card.value > currentWinnerCard.value
                );
                if (bestShotList.length) {
                    return bestShotList
                        .map(card =>
                            Object.assign({}, card, {
                                diff: card.value - currentWinnerCard.value
                            })
                        )
                        .sort((cardA, cardB) => cardA.diff - cardB.diff)[0];
                } else {
                    return sameRankCards[sameRankCards.length - 1];
                }
            }
            // if no same rank card  and current player has trumps cards
        } else if (currentPlayerhasTrumpCards) {
            // if my enemy has send trump card
            if (isCurrentWinnerCardATrump) {
                let bestTrumpShot = allTrumpCard
                    .filter(card => card.value > currentWinnerCard.value)
                    .map(card =>
                        Object.assign({}, card, {
                            diff: card.value - currentWinnerCard.value
                        })
                    )
                    .sort((cardA, cardB) => cardA.diff - cardB.diff);
                if (
                    bestTrumpShot.length &&
                    currentHand.some(
                        card => !checkIfCardTrump(card, game.bid.trump)
                    )
                ) {
                    return bestTrumpShot[0];
                } else {
                    return currentHand.sort(
                        (cardA, cardB) =>
                            (cardA.value % 13) - (cardB.value % 13)
                    )[0];
                }
            } else {
                return bestTrumpCard;
            }
        } else {
            return currentHand.sort(
                (cardA, cardB) => (cardA.value % 13) - (cardB.value % 13)
            )[0];
        }
    }
    // return currentHand.sort((cardA, cardB) => (cardA.value % 13) - (cardB.value % 13))[0];
};

exports.isCurrentCardTrump = function(card, trump) {
    return Math.floor(card.value / 13) === trump;
};

exports.followFirstCard = function(currentHand, firstCard) {
    return currentHand.filter(
        card =>
            Math.floor(card.value / 13) === Math.floor(firstCard.value / 13)
    );
};

exports.sameTeam = function(card, deal) {
    return card.player % 2 === deal % 2;
};

exports.cardsByPlayer = function(players, cards) {
    return players.map((userIndex, index) => {
        return cards.filter(
            (card, i) => i % players.length === index && card.trick === 0
        );
    });
};

exports.firstCard = function(cards, order) {
    // what is the first card of current trick
    // in order to let players only can draw card as the same suit
    if (
        cards &&
        cards.length >= CONST.PLAYER_NUM &&
        order % CONST.PLAYER_NUM !== CONST.PLAYER_NUM - 1
    ) {
        return cards
            .filter(card => card.order % CONST.PLAYER_NUM === 0)
            .sort((cardA, cardB) => cardB.order - cardA.order)[0];
    }
    return null;
};

exports.maxTrick = function(cards) {
    if (!cards || !cards.length) {
        return null;
    }
    return Math.max(...cards.map(card => card.trick)) || 0;
};

exports.nextTrick = function(cards) {
    let maxTrick = Math.max(...cards.map(card => card.trick)),
        maxTrickNum = cards.filter(card => card.trick === maxTrick).length;
    if (maxTrick === 0 || maxTrickNum >= 4) {
        return maxTrick + 1;
    }
    return maxTrick;
};

exports.trickCard = function(cards) {
    let maxTrick = module.exports.maxTrick(cards);
    if (!maxTrick || maxTrick <= 0) {
        return [];
    }
    let trickCards = cards.filter(card => card.trick === maxTrick);
    return trickCards;
};

exports.getMaxValueByTrump = function(arr, trump) {
    if (!arr || trump === null || trump === undefined) {
        return null;
    }
    let list = arr
        .filter(item => Math.floor(item.value / CONST.CARD_NUM.HAND) === trump)
        .sort((cardA, cardB) => cardB.value - cardA.value);

    return list.length ? list[0] : null;
};

exports.getWinner = function(game, cardValue) {
    let findMaxValueByTrump = module.exports.getMaxValueByTrump;

    if (!game) return null;

    let cards = game.cards,
        maxTrick = module.exports.maxTrick(cards);

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
        if (trump !== CONST.NO_TRUMP) {
            // filter trump cards, and compare their face value
            let tmp = findMaxValueByTrump(cardsMatchCurrentTrick, trump);

            if (tmp !== null) {
                winnerCard = tmp;
            } else {
                noTrumpCards = true;
            }
        }

        if (trump === CONST.NO_TRUMP || noTrumpCards) {
            // if their quotient are the same, compare their value, else, let first win
            let trumpRef = Math.floor(firstHand.value / CONST.CARD_NUM.HAND);
            winnerCard = findMaxValueByTrump(cardsMatchCurrentTrick, trumpRef);
        } // end of no trump
    }
    return (winnerCard || null);
};
