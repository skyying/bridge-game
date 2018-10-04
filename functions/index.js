"use strict";

const functions = require("firebase-functions");
// import * as functions from "firebase-functions";

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const request = require("request");
const app = require("express")();

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require("firebase-admin");
admin.initializeApp();

const getAllDataOnce = (path, callback) => {
    admin
        .database()
        .ref(path)
        .once("value", callback);
};
// functions for change data in database
const listenPathDataChange = type => (path, callback) =>
    admin
        .database()
        .ref(path)
        .on(type, callback);

const alwaysListenPathDataChange = listenPathDataChange("value");

// when a new table is added, add table id to list;
const listenNewTableAdded = listenPathDataChange("child_added");
const listenTableRemoved = listenPathDataChange("child_removed");

let tableIdList = [];
const fetchLiveTableId = (newTable, tableIdList) => {
    let tableId = newTable.id;
    tableIdList.push({id: tableId, timer: null});
    console.log("tableIdList, in fetchLiveTableId", tableIdList);
};

// when a table is deleted, remove it from list;

const removeLiveTableId = (oldTableList, newTableList) => {
    return oldTableList.findIndex(table => newTableList[table.id] !== true);
};

const fitlerRemovedTable = (oldTables, newTables) => {};

// if new table is added, update table list
listenNewTableAdded("tables", snapshot =>
    fetchLiveTableId(snapshot.val(), tableIdList),
);
// if table is removed, update current table list
listenTableRemoved("tables", snapshot => {
    getAllDataOnce("tables", tables => {
        let removedIndex = removeLiveTableId(tableIdList, tables.val());
        console.log("removedIndex", removedIndex);
        tableIdList.splice(removedIndex, 1);
        console.log("tableIdList, in remove,", tableIdList);
    });
});

exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send(test());
});

let tableTimer, timers;
let waitingInterval = 3000;

const stop = timer => {
    if (timer) {
        clearTimout(timer);
        timer = 0;
    }
};

const startCountDown = (timer, id) => {
    if (timer) {
        stop();
    }
    return setTimeout(() => deal, waitingInterval);
};
