const Db = require("./db.js");
const CONST = require("./constant.js");

exports.init = () => {
    Db.getAllDataOnce("tables", snapshot => {
        let hasAnyTables = snapshot.val();
        if (!hasAnyTables) {
            module.exports.create();
        }
    });
};

exports.getAll = (newTable, tableIdList) => {
    console.log("tables", tableIdList);
    let list = Object.assign({}, tableIdList);
    let tableId = newTable.id;
    list[tableId] = {
        id: tableId,
        timer: null,
        timeStamp: newTable.timeStamp
    };
    return list;
};

exports.update = (oldTableList, newTableList) => {
    if (!newTableList) {
        return null;
    }
    return Object.keys(oldTableList).filter(
        tableId => !newTableList[tableId]
    );
};

exports.create = () => {
    let tableKey = Db.getNewChildKey("tables");
    let tableRef = new Date().getTime();
    let newTable = {
        timeStamp: tableRef,
        createTime: tableRef,
        gameState: "join",
        id: tableKey,
        linkId: tableRef,
        game: CONST.DEFAULT_GAME,
        playerInfo: {
            "C1-robot": {displayName: "C1-robot"},
            "C2-robot": {displayName: "C2-robot"},
            "C3-robot": {displayName: "C3-robot"},
            "-1": {displayName: ""}
        },
        players: CONST.PLAYERS,
        ready: [false, false, false, false]
    };
    Db.setTableDataById(newTable);
    Db.setTableListData(newTable.linkId, {
        id: newTable.id,
        playerInfo: {
            "C1-robot": {displayName: "C1-robot"},
            "C2-robot": {displayName: "C2-robot"},
            "C3-robot": {displayName: "C3-robot"},
            "-1": {displayName: ""}
        }
    });
};

exports.close = table => {
    console.log("should print this, in Tables.close");
    let updateTable = Object.assign(
        {},
        table,
        {gameState: "close"},
        {timeStamp: new Date().getTime()}
    );
    Db.setTableDataById(updateTable);
    // Db.setTableListData(updateTable.linkId, null);
};
