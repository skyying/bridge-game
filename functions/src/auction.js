const Db = require("./db.js");

exports.update = table => {
    console.log("in auction.update,should check if has cards", table);
    let updatedTable = Object.assign({}, table);
    if (!updatedTable.game.bid.result) {
        updatedTable.game.bid.result = [{opt: "Pass"}];
    } else {
        updatedTable.game.bid.result.push({opt: "Pass"});
    }
    updatedTable.game.deal = (table.game.deal + 1) % 4;
    updatedTable.timeStamp = new Date().getTime();
    console.log("in update auction");
    Db.setTableDataById(updatedTable);
};

exports.isFinish = function(table) {
    if (!table || !table.game.bid.result) return false;
    let {game} = table;
    let {result} = game.bid;
    if (result.length >= 4) {
        let isAllPass = result
            .slice(result.length - 3, result.length)
            .every(res => res.opt === "Pass");
        let isGreaterThanFour = result.length >= 4;
        let hasValidTrump = result.some(bid => bid.trick >= 0);
        return isAllPass && isGreaterThanFour && hasValidTrump;
    }
    return false;
};
