const state = require("./gameState.js");
const Db = require("./db.js");
const CONST = require("./constant.js");

exports.getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// let EMPTY_SEAT = -1;
exports.new = () => {
    let cards = module.exports.getRandomCards();
    while (!module.exports.validateShuffle(cards)) {
        cards = module.exports.getRandomCards();
    }
    return cards.map(facevalue => ({value: facevalue, trick: 0}));
};

exports.getRandomCards = () => {
    // get a random array with not-repeated 0-51 digit in it
    let cards = Array.from({length: CONST.CARD_NUM.TOTAL})
        .fill(0)
        .map((card, i) => i);

    // shuffle array algorithm
    for (let i = cards.length - 1; i > 0; i--) {
        let randomIndex = module.exports.getRandomInt(
            0,
            CONST.CARD_NUM.TOTAL - 1
        );

        [cards[i], cards[randomIndex]] = [cards[randomIndex], cards[i]];
    }

    return cards;
};

exports.deal = cards => {
    // split random array to 4 sub arrays
    return [0, 0, 0, 0]
        .map((userIndex, index) => {
            return cards.filter((card, i) => i % 4 === index);
        })
        .slice(0);
};
// J=1, Q=2, K=3, A=4 points;
// check if those sub array has at least 7 points

exports.validateShuffle = cards => {
    const TOTAL_CARD_VALUE = 8;
    return module.exports.deal(cards)
        .map(hand =>
            hand.map(
                value =>
                    value % CONST.TOTAL_TRICKS > TOTAL_CARD_VALUE
                        ? (value % CONST.TOTAL_TRICKS) - TOTAL_CARD_VALUE
                        : 0
            )
        )
        .every(
            hand =>
                hand.reduce((sum, value) => value + sum, 0) >=
                TOTAL_CARD_VALUE - 1
        );
};
