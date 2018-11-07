const state = require("./gameState.js");
const Db = require("./db.js");
const CONST = require("./constant.js");
const Deck = require("./deck.js");

// let EMPTY_SEAT = -1;
exports.addAvatar = table => {
    let {players} = table;
    let avatar = [1, 2, 3];
    let index = 0;
    let deck = Deck.new();

    let avaters = players.map(player => {
        return player === CONST.EMPTY_SEAT
            ? `C${avatar[index++]}-robot`
            : player;
    });
    if (table.game && !table.game.cards) {
        table.game.cards = deck;
    }

    let newTable = Object.assign(
        {},
        table,
        {ready: [true, true, true, true]},
        {players: avaters},
        {gameState: state.phase.auction},
        {timeStamp: new Date().getTime()}
    );
    Db.setTableDataById(newTable);
    Db.setTableListData(table.linkId, {
        id: table.id,
        players: avaters,
        playerInfo: table.playerInfo
    });
};

exports.join = table => {
    let tableData = Object.assign({}, table);
    if (table.ready.some(state => state === true)) {
        module.exports.addAvatar(tableData);
    } else {
        tableData.gameState = state.phase.close;
        tableData.timeStamp = new Date().getTime();
        Db.setTableDataById(tableData);
    }
};
