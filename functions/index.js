"use strict";

const functions = require("firebase-functions");
const request = require("request");
const app = require("express")();
const admin = require("firebase-admin");
const Game = require("./src/game.js");
const Db = require("./src/db.js");
const Tables = require("./src/tables.js");
const Auction = require("./src/auction.js");
const Players = require("./src/players.js");
const state = require("./src/gameState.js");

let tableIdList = {};

Db.init();
Tables.init();

const listenNewTableAdded = Db.listenPathDataChange("child_added");
const listenTableRemoved = Db.listenPathDataChange("child_removed");
const listenTableChanged = Db.listenPathDataChange("child_changed");
// when a new table is added, add table id to list;

// if new table is added, update table list
listenNewTableAdded("tables", snapshot => {
    Tables.getAll(snapshot.val(), tableIdList);
});
// if table is removed, update current table list
listenTableRemoved("tables", snapshot => {
    Db.getAllDataOnce("tables", tables => {
        let removeKey = Tables.update(tableIdList, tables.val());
        if (removeKey < 0) {
            tableIdList = {};
            Tables.create();
        } else {
            delete tableIdList[removeKey];
        }
    });
});

// when table is change, handle TimeStamp
listenTableChanged("tables", snapshot => {
    let tableData = snapshot.val();
    console.log("gameState-----", tableData.gameState);
    let {ready, gameState, id, timeStamp} = tableData;
    if (timeStamp !== tableIdList[id].timeStamp) {
        tableIdList[id].timeStamp = timeStamp;
    }
    if (gameState === state.phase.join) {
        let isAllReady = ready.every(state => state === true);
        let readyCount = ready.filter(state => state === true).length;
        if (isAllReady) {
            let newTable = Object.assign(
                {},
                tableData,
                {gameState: state.phase.auction},
                {timeStamp: new Date().getTime()},
            );
            Db.setTableDataById(newTable);
            // todo: should set to a button
        } else {
            initTimer(
                tableIdList[tableData.id],
                tableData,
                Players.join,
                10000,
            );
        }
    } else if (gameState === state.phase.auction) {
        // if still in acution, set timer
        let isFinishAuction = Auction.isFinish(tableData);
        if (!isFinishAuction) {
            initTimer(
                tableIdList[tableData.id],
                tableData,
                Auction.update,
                4000,
            );
        } else {
            Db.setTableData("gameState", tableData.id, state.phase.playing);
        }
    } else if (gameState === state.phase.playing) {
        if (tableData.game.order < 51) {
            initTimer(tableIdList[tableData.id], tableData, Game.deal, 6000);
        }
    } else if (gameState === state.phase.gameover) {
        initTimer(tableIdList[tableData.id], tableData, Tables.close, 10000);
    } else if (gameState === "close") {
        Db.setTableData("", tableData.id, null);
    }
    return;
});

// timer.timer = setTimeout(() => Auction.update(table), 6000);
const initTimer = (timer, table, callback, interval) => {
    if (timer.timer) {
        clearTimeout(timer.timer);
    }
    timer.timer = null;
    timer.timer = setTimeout(() => {
        callback(table);
    }, interval);
};

exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send(test());
});
