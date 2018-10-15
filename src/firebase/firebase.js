import firebase from "firebase";
import {config} from "./config.js";

export const firebaseApp = firebase.initializeApp(config);

export const app = {
  db: firebaseApp.database(),
  auth: firebaseApp.auth(),
  onAuthChanged: callback => {
    firebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        callback(user);
      } else {
        console.log("no one login");
      }
    });
  },
  getNodeByPathOnce: (path, action) => {
    return firebaseApp
      .database()
      .ref(path)
      .on("value", action);
  },
  getNodeByPath: (path, action) => {
    return firebaseApp
      .database()
      .ref(path)
      .on("value", action);
  },
  pushDataByPath: (path, data) => {
    return firebaseApp
      .database()
      .ref(path)
      .push(data);
  },
  cancelListenDataChange: (path, action) => {
    return firebaseApp
      .database()
      .ref(path)
      .off("value", action);
  },
  listenPathChildren: (path, action) => {
    return firebaseApp
      .database()
      .ref(path)
      .off("value");
  },
  setNodeByPath: (path, data) => {
    return firebaseApp
      .database()
      .ref(path)
      .set(data);
  },
  getDataByPathOnce: (path, action) => {
    return firebaseApp
      .database()
      .ref(path)
      .once("value", action);
  },
  getNewChildKey: node => {
    return firebaseApp
      .database()
      .ref()
      .child(node)
      .push().key;
  },
  updateTableDataByID: (id, data) => {
    firebaseApp
      .database()
      .ref(`tables/${id}/`)
      .set(data);
  },
  updateTableGameDataByPath: (path, game) => {
    firebaseApp
      .database()
      .ref("tables/" + path)
      .set(game);
  },
  setTableListData: (id, data) => {
    firebaseApp
      .database()
      .ref(`tableList/${id}/`)
      .set(data);
  }
};
