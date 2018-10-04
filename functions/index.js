"use strict";

const functions = require("firebase-functions");
const request = require("request");
const app = require("express")();
const admin = require("firebase-admin");
const Game = require("./src/game.js");
const Db = require("./src/db.js");
const Tables = require("./src/tables.js");
const Auction = require("./src/auction.js");
Db.init();

// when a new table is added, add table id to list;
const listenNewTableAdded = Db.listenPathDataChange("child_added");
const listenTableRemoved = Db.listenPathDataChange("child_removed");
const listenTableChanged = Db.listenPathDataChange("child_changed");

let tableIdList = {};

// if new table is added, update table list
listenNewTableAdded("tables", snapshot => {
    Tables.getAll(snapshot.val(), tableIdList);
    console.log("new table", snapshot.val());
});
// if table is removed, update current table list
listenTableRemoved("tables", snapshot => {
    Db.getAllDataOnce("tables", tables => {
        let removeKey = Tables.update(tableIdList, tables.val());
        if (removeKey < 0) {
            tableIdList = {};
        } else {
            delete tableIdList[removeKey];
        }
    });
});

// when table is change, handle TimeStamp
listenTableChanged("tables", snapshot => {
    let table = snapshot.val();
    let {ready, gameState} = table;
    if (gameState === 0) {
        let isAllReady = ready.every(state => state === true);
        if (isAllReady) {
            Db.setTableData("gameState", table.id, 1);
        }
    } else if (gameState === 1) {
        // if still in acution, set timer
        if (!Auction.isFinish(table)) {
            initTimer(tableIdList[table.id], table);
        } else {
            Db.setTableData("gameState", table.id, 2);
        }
    } else if (gameState === 2) {
      console.log("game state === 2");
    }
});

const initTimer = (timer, table) => {
    if (timer.timer) {
        clearTimeout(timer.timer);
    }
    timer.timer = setTimeout(() => Auction.update(table), 6000);
    console.log(table.timeStamp);
};

let tableTimer, timers;
let waitingInterval = 3000;

// test
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send(test());
});
