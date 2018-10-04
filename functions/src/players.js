const state = require("./gameState.js");
const Db = require("./db.js");

// let EMPTY_SEAT = -1;
exports.addAvatar = table => {
    let {players} = table;
    let avaters = players.map(
        (player, index) => (player === -1 ? `C-${index}` : player),
    );
    let newTable = Object.assign(
        {},
        table,
        {ready: [true, true, true, true]},
        {players: avaters},
        {gameState: state.phase.auction},
        {timeStamp: new Date().getTime()},
    );
    // console.log("xxxxxxxxxxxxx");
    // console.log("table", table);
    // console.log("newTable", newTable);
    // console.log("------------");
    Db.setTableDataById(newTable);
};
