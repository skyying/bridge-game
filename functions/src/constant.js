exports.CARD_NUM = {
    TOTAL: 52,
    SUITS: 4,
    HAND: 13,
};

exports.TOTAL_TRICKS = 13;
exports.PLAYER_NUM = 4;
exports.EMPTY_SEAT = -1;
exports.NO_TRUMP = 4;
exports.BID_NUM = [1, 2, 3, 4, 5, 6, 7];

exports.CARD_RANK = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];

exports.DEFAULT_GAME = {
    deal: 0,
    bid: {
        isDb: false,
        isRdb: false,
        trick: 0,
        trump: -1,
    },
    order: -1,
    isGameOver: false,
};

exports.PLAYERS = [
    this.EMPTY_SEAT,
    this.EMPTY_SEAT,
    this.EMPTY_SEAT,
    this.EMPTY_SEAT,
];
exports.GAME_STATE = {
    join: "join",
    auction: "auction",
    playing: "playing",
    gameover: "gameover",
};
