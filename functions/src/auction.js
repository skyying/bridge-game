const Db = require("./db.js");

exports.update = table => {
    let updatedTable = Object.assign({}, table);
    if (!updatedTable.game.bid.result) {
        updatedTable.game.bid.result = [{opt: "Pass"}];
    } else {
        updatedTable.game.bid.result.push({opt: "Pass"});
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
    let hasValidTrump = game.bid.trump > 0;
    return isAllPass && hasValidTrump;
};
