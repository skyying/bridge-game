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
Tables.init();

const timeout = {
    join: 15000,
    auction: {
        human: 60000,
        robot: 3000
    },
    playing: {
        human: 60000,
        robot: 4000
    },
    close: 15000
};

const robotName = "-robot";

const listenNewTableAdded = Db.listenPathDataChange("child_added");
const listenTableRemoved = Db.listenPathDataChange("child_removed");
const listenTableChanged = Db.listenPathDataChange("child_changed");
// when a new table is added, add table id to list;

// if new table is added, update table list
listenNewTableAdded("tables", snapshot => {
    tableIdList = Tables.getAll(snapshot.val(), tableIdList);
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
    let {ready, gameState, id, timeStamp} = tableData;
    if (timeStamp !== tableIdList[id].timeStamp) {
        tableIdList[id].timeStamp = timeStamp;
    }
    if (gameState === state.phase.join) {
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
                timeout.join
            );
        }
    } else if (gameState === state.phase.auction) {
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
            Db.setTableData("gameState", tableData.id, state.phase.playing);
        }
    } else if (gameState === state.phase.playing) {
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
        initTimer(
            tableIdList[tableData.id],
            tableData,
            Tables.close,
            timeout.close
        );
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
