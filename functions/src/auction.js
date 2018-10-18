const Db = require("./db.js");
const state = require("./gameState.js");

exports.update = table => {
    let updatedTable = Object.assign({}, table);

    if (!updatedTable.game.bid.result) {
        updatedTable.game.bid.result = [{opt: "Pass"}];
    } else {
        updatedTable.game.bid.result.push({opt: "Pass"});
    }

    let result = updatedTable.game.bid.result;

    // check it overbid
    if (
        result.length >= 8 &&
        result.slice(result.length - 8).every(bid => bid.opt === "Pass")
    ) {
        updatedTable.gameState = state.phase.close;
    }

    updatedTable.game.deal = (table.game.deal + 1) % 4;
    updatedTable.timeStamp = new Date().getTime();

    Db.setTableDataById(updatedTable);
};

exports.isFinish = function(table) {
    if (!table || !table.game.bid.result || table.game.bid.result.length < 4) {
        return false;
    }
    let game = table.game;
    let result = game.bid.result;
    let isAllPass = result
        .slice(result.length - 3, result.length)
        .every(res => res.opt === "Pass");
    return isAllPass && game.bid.trump >= 0;
};
