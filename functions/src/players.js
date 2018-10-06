const state = require("./gameState.js");
const Db = require("./db.js");
const CONST = require("./constant.js");

// let EMPTY_SEAT = -1;
exports.addAvatar = table => {
    let {players} = table;
    let avatar = [1, 2, 3];
    let index = 1;
    let avaters = players.map(player => {
        return player === CONST.EMPTY_SEAT ? `C${avatar[index++]}` : player;
    });
    let newTable = Object.assign(
        {},
        table,
        {ready: [true, true, true, true]},
        {players: avaters},
        {gameState: state.phase.auction},
        {timeStamp: new Date().getTime()},
    );
    Db.setTableDataById(newTable);
};

exports.join = table => {
    let tabelData = Object.assign({}, table);
    if (table.ready.some(state => state === true)) {
        module.exports.addAvatar(tabelData);
    } else {
        tabelData.gameState = state.phase.close;
        tabelData.timeStamp = new Date().getTime();
        Db.setTableDataById(tabelData);
    }
};
