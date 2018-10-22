const Db = require("./db.js");
const state = require("./gameState.js");
const AUCTION_TIMES = 8;
const PLAYER_NUM = 4;

exports.update = table => {
    let updatedTable = Object.assign({}, table);
    if (!updatedTable.game.bid.result) {
        updatedTable.game.bid.result = [{opt: "Pass"}];
    } else {
        updatedTable.game.bid.result.push({opt: "Pass"});
    }

    let result = updatedTable.game.bid.result;

    // check if last two round of bids are all invalid, if yes, close this table
    if (
        result.length >= AUCTION_TIMES &&
        result
            .slice(result.length - AUCTION_TIMES, result.length)
            .every(bid => bid.opt === "Pass")
    ) {
        updatedTable.gameState = state.phase.close;
    }
    
    updatedTable.game.deal = (updatedTable.game.deal + 1) % PLAYER_NUM;
    updatedTable.timeStamp = new Date().getTime();

    Db.setTableDataById(updatedTable);
};

exports.isFinish = function(table) {
    if (
        !table ||
        !table.game.bid.result ||
        table.game.bid.result.length < PLAYER_NUM
    ) {
        return false;
    }
    let game = table.game;
    let result = game.bid.result;

    // console.log("result, should have correct result", result);

    let isAllPass = result
        .slice(result.length - PLAYER_NUM, result.length)
        .every(res => res.opt === "Pass");

    // console.log("in isFinish ----, ");
    // console.log("isAllPass, ", isAllPass);
    return result.length >= 4 && isAllPass && game.bid.trump >= 0;
};
