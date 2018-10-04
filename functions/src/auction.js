const Db = require("./db.js");

exports.update = table => {
    let updatedTable = Object.assign({}, table);
    updatedTable.game.bid.result.push({opt: "Pass"});
    updatedTable.game.deal = (table.game.deal + 1) % 4;
    updatedTable.game.TimeStamp = new Date().getTime();
    Db.setTableDataById(updatedTable);
};

exports.isFinish = function(table) {
    if (!table) return;
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
