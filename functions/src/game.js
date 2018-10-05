const CONST = require("./constant.js");
const CardsSet = require("./cards.js");

exports.getMaxValueByTrump = function(arr, trump) {
    if (!arr || trump === null || trump === undefined) {
        return;
    }
    let list = arr
        .filter(item => Math.floor(item.value / CONST.CARD_NUM.HAND) === trump)
        .sort((cardA, cardB) => cardB.value - cardA.value);
    return list.length ? list[0] : null;
};

exports.getWinner = function(game, cardValue) {
    let findMaxValueByTrump = module.exports.getMaxValueByTrump;

    if (!game) return;
    let cards = game.cards,
        maxTrick = module.exports.maxTrick(cards);

    let {trump} = game.bid;
    let cardsMatchCurrentTrick = cards
        .map((card, index) => Object.assign({}, card, {index: index}))
        .filter(
            card =>
                (card.trick === maxTrick && card.trick > 0) ||
                card.value === cardValue,
        );
    let winnerCard,
        noTrumpCards = false;

    if (cardsMatchCurrentTrick.length === 4) {
        // which card is first been played
        let first = Math.min(...cardsMatchCurrentTrick.map(card => card.order));
        let [firstHand] = cardsMatchCurrentTrick.filter(
            card => card.order === first,
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
    return winnerCard || null;
};

exports.deal = function(table) {
    let bestGuess = module.exports.guess(table);
    bestGuess.order = table.game.order + 1;
    bestGuess.player = table.game.deal;
    console.log("bestGuess", bestGuess);
    let winnerCard = module.exports.getWinner(
        Object.assign({}, table.game),
        bestGuess.value,
    );
    if (winnerCard && winnerCard.value === bestGuess.value) {
        console.log("this card is winner");
        // let updated = Object.assign({}, table);
    }
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
    let dealCard;

    currentHand = currentHand[game.deal];

    let allTrumpCard = currentHand
        .filter(card => checkIfCardTrump(card, game.bid.trump))
        .sort((a, b) => a.value - b.value);

    let bestTrumpCard = allTrumpCard[0];

    let hasTrumpCards = allTrumpCard.length > 0;

    let currentTrumpWinnerCard, currentWinner;

    if (getFirstCard) {
        console.log("--------------------");
        currentTrumpWinnerCard =
            currentTrickCards
                .filter(card => checkIfCardTrump(card, game.bid.trump))
                .sort((cardA, cardB) => cardB.value - cardA.value)[0] || null;

        currentWinner =
            currentTrumpWinnerCard ||
            currentTrickCards
                .filter(
                    card =>
                        Math.floor(card.value / 13) ===
                        Math.floor(getFirstCard.value / 13),
                )
                .sort((cardA, cardB) => cardB.value - cardA.value)[0] ||
            null;

        let isWinnerTrump = checkIfCardTrump(currentWinner, game.bid.trump);

        console.log("currentTrumpWinnerCard", currentTrumpWinnerCard);
        console.log("currentWinner", currentWinner);
        console.log("--------------------");
    }
    // cards are dealed by enemys
    let enemyCardsOnTrick = currentTrickCards.filter(
        card => card.player % 2 !== game.deal % 2,
    );

    let cardsForFirstDraw = currentHand.sort(
        (cardA, cardB) => (cardB.value % 13) - (cardA.value % 13),
    );

    //  when no first cards, deal with first card
    if (!currentTrickCards.length || !getFirstCard) {
        console.log("------------------");
        console.log("first, you should send", cardsForFirstDraw[0]);
        console.log("1111111111111");
        console.log("------------------");
        return cardsForFirstDraw[0];
    } else {
        // chech has which availiabe cards at the same rank;
        let sameRankCards = module.exports.followFirstCard(
            currentHand,
            getFirstCard,
        );

        if (sameRankCards.length === 1) {
            console.log("22222222222222");
            console.log("------------------");
            console.log("only one same card");
            console.log("you should send", sameRankCards[0]);
            console.log("------------------");
            return sameRankCards[0];

            // has more than one same rank cards
        } else if (sameRankCards.length > 1 && currentWinner) {
            // lost strategy, if your partner win, or if enemey has send
            // trump card
            if (
                // partner win
                isSameTeam(currentWinner, game.deal) ||
                // enemy has trump and you have same rank card
                (!isSameTeam(currentWinner, game.deal) &&
                    checkIfCardTrump(currentWinner, game.bid.trump)) ||
                // enemy has win, and your cards can't beat winner
                (!isSameTeam(currentWinner, game.deal) &&
                    sameRankCards[0].value < currentWinner.value)
            ) {
                console.log("333333333333333");
                console.log("------------------");
                console.log("lose stratgy");
                console.log(
                    "bestShot",
                    sameRankCards[sameRankCards.length - 1],
                );
                console.log("------------------");
                return sameRankCards[sameRankCards.length - 1];
            } else {
                console.log("444444444444444");
                // winner stratgy, find most possible answer
                let diff = 52;

                let bestShot = sameRankCards
                    .filter(card => card.value > currentWinner.value)
                    .map(card =>
                        Object.assign({}, card, {
                            diff: card.value - currentWinner.value,
                        }),
                    )
                    .sort((cardA, cardB) => cardA.diff - cardB.diff)[0];
                console.log("------------------");
                console.log("winning stratgy");
                console.log("bestShot", bestShot);
                console.log("------------------");
                return bestShot;
            }

            // if no same rank card  and has trumps cards
        } else if (hasTrumpCards) {
            // if my enemy has send trump card
            console.log("555555555555555");
            if (isWinnerTrump) {
                console.log("666666666666666");
                let bestTrumpShot = allTrumpCard
                    .filter(card => card.value > currentWinner.value)
                    .map(card =>
                        Object.assign({}, card, {
                            diff: card.value - currentWinner.value,
                        }),
                    )
                    .sort((cardA, cardB) => cardA.diff - cardB.diff);
                if (
                    bestTrumpShot.length &&
                    currentHand.some(
                        card => !checkIfCardTrump(card, game.bid.trump),
                    )
                ) {
                    console.log("777777777777");
                    console.log(
                        "enemy has trump card, and send the best shot trump ",
                        bestTrumpShot[0],
                    );
                    return bestTrumpShot[0];
                } else {
                    console.log("7777777777--111111");
                    console.log(
                        "send other cards",
                        currentHand.sort(
                            (cardA, cardB) => cardA.value - cardB.value,
                        )[0],
                    );
                    return currentHand.sort(
                        (cardA, cardB) => cardA.value - cardB.value,
                    )[0];
                }
            } else {
                console.log("888888888888888");
                console.log(
                    "send card, no same rank and has trump and no on has send trump card yet",
                    bestTrumpCard,
                );
                return bestTrumpCard;
            }
        } else {
            console.log("if not first draw, and not all case above,");
            console.log("99999999999999999");
            console.log(
                "send other cards",
                currentHand.sort(
                    (cardA, cardB) => cardA.value - cardB.value,
                )[0],
            );

            return currentHand.sort(
                (cardA, cardB) => cardA.value - cardB.value,
            )[0];
        }
    }
    return null;
};

exports.isCurrentCardTrump = function(card, trump) {
    return Math.floor(card.value / 4) === trump;
};

exports.followFirstCard = function(currentHand, firstCard) {
    return currentHand.filter(
        card =>
            Math.floor(card.value / 13) === Math.floor(firstCard.value / 13),
    );
};

exports.sameTeam = function(card, deal) {
    return card.player % 2 === deal % 2;
};
exports.cardsByPlayer = function(players, cards) {
    return players.map((userIndex, index) => {
        return cards.filter(
            (card, i) => i % players.length === index && card.trick === 0,
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

exports.trickCard = function(cards) {
    let maxTrick = module.exports.maxTrick(cards);
    if (!maxTrick || maxTrick <= 0) {
        return [];
    }
    let trickCards = cards.filter(card => card.trick === maxTrick);
    return trickCards;
};
