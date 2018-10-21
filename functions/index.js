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
const FBASE = require("./config.js");

process.env.GCLOUD_PROJECT = FBASE.projectId;
process.env.FIREBASE_CONFIG = FBASE.config;

let tableIdList = {};

Db.init();

const timeout = {
    join: 15000,
    auction: {
        human: 10000,
        robot: 3000
    },
    playing: {
        human: 30000,
        robot: 3000
    },
    close: 10000
};

const robotName = "-robot";

const listenNewTableAdded = Db.listenPathDataChange("child_added");
const listenTableRemoved = Db.listenPathDataChange("child_removed");
const listenTableChanged = Db.listenPathDataChange("child_changed");
// when a new table is added, add table id to list;

listenNewTableAdded("tables", snapshot => {
    tableIdList = Tables.getAll(snapshot.val(), tableIdList);
    console.log("tableIdList", tableIdList);
});

// if table is removed, update current table list
listenTableRemoved("tables", snapshot => {
    Db.getAllDataOnce("tables", tables => {
        let removeKeys = Tables.update(tableIdList, tables.val());
        if (!removeKeys) {
            tableIdList = {};
        } else {
            removeKeys.map(key => {
                // clear timeout callback before remove table;
                clearTimeout(tableIdList[key].timer);
                delete tableIdList[key];
            });
        }
    });
});

listenTableChanged("tables", snapshot => {
    if (!snapshot.val()) {
        console.log("NO ANY DATA");
        return null;
    }

    // console.log("timeStamp", timeStamp);
    let tableData;
    let ready, gameState, id, timeStamp;

    try {
        if (!tableIdList) {
            throw new Error("NO DATA OF THIS TABLE");
        }
        if (!snapshot.val()) {
            Object.keys(tableIdList).map(id =>
                clearTimeout(tableIdList[id].timer)
            );
            tableIdList = Tables.getAll(snapshot.val(), tableIdList);
            throw new Error("NO CHANGED TABLE DATA ON DATABASE");
        }

        tableData = snapshot.val();

        id = tableData.id;

        if (!tableIdList[id]) {
            throw new Error("NO DATA OF THIS TABLE ON SERVER TABLELIST OBJECT");
        }

        ready = tableData.ready;

        gameState = tableData.gameState;

        timeStamp = tableData.timeStamp;

        if (timeStamp !== tableIdList[id].timeStamp) {
            tableIdList[id].timeStamp = timeStamp;
        }
    } catch (e) {
        console.log(e.message);
        console.log(e.name);
        return null;
    }

    if (gameState === state.phase.join) {
        console.log("join");

        let isAllReady = ready.every(state => state === true);
        if (isAllReady) {
            let newTable = Object.assign(
                {},
                tableData,
                {gameState: state.phase.auction},
                {timeStamp: new Date().getTime()}
            );
            Db.setTableDataById(newTable);
        } else {
            initTimer(
                tableIdList[tableData.id],
                tableData,
                Players.join,
                timeout.join -
                    (new Date().getTime() - Number(tableData.createTime))
            );
        }
    } else if (gameState === state.phase.auction) {
        console.log("in auction");
        // if still in acution, set timer
        let isFinishAuction = Auction.isFinish(tableData);
        if (!isFinishAuction) {
            // set timer
            let timerInterval = timeout.auction.robot;
            let players = tableData.players;
            if (!players[tableData.game.deal].includes(robotName)) {
                timerInterval = timeout.auction.human;
            }
            initTimer(
                tableIdList[tableData.id],
                tableData,
                Auction.update,
                timerInterval
            );
        } else {
            clearTimeout(tableIdList[tableData.id].timer);
            tableData.game.deal = (tableData.game.bid.declarer + 1) % 4;
            tableData.gameState = state.phase.playing;
            tableData.timeStamp = new Date().getTime();
            Db.setTableDataById(tableData);
        }
    } else if (gameState === state.phase.playing) {
        console.log("playing");
        let timerSec = timeout.playing.robot;
        if (tableData.game.order <= 51) {
            let players = tableData.players;
            let dummyIndex = (tableData.game.bid.declarer + 2) % 4;
            let isDummyHandARobot = players[dummyIndex].includes(robotName);
            let isDeclarerRobot = players[tableData.game.bid.declarer].includes(
                robotName
            );

            // if a human player
            if (!players[tableData.game.deal].includes(robotName)) {
                timerSec = timeout.playing.human;
            }
            // if robot is a dummyhand and control by human, and its dummy hands' turn
            if (
                isDummyHandARobot &&
                !isDeclarerRobot &&
                dummyIndex === tableData.game.deal
            ) {
                timerSec = timeout.playing.human;
            }
            initTimer(
                tableIdList[tableData.id],
                tableData,
                Game.deal,
                timerSec
            );
        }
    } else if (gameState === state.phase.gameover) {
        console.log("game over");
        initTimer(
            tableIdList[tableData.id],
            tableData,
            Tables.close,
            timeout.close
        );
    } else if (gameState === state.phase.close) {
        Db.setTableData("", tableData.id, null);
        Db.setTableListData(tableData.linkId, null);
    }
    return null;
});

const initTimer = (timer, table, callback, interval) => {
    try {
        if (!timer) {
            throw new Error(
                "TABLE DOESN'T EXIST. CAN'T SET TIMER ON AN UNDEFINED OBJECT"
            );
        }
    } catch (e) {
        console.log(e.message);
    }

    clearTimeout(timer.timer);

    timer.timer = null;

    timer.timer = setTimeout(() => {
        callback(table);
    }, interval);
};
