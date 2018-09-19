import firebase from "firebase";
import {config} from "./config.js";

let firebaseApp = firebase.initializeApp(config);

export const app = {
  db: firebaseApp.database(),
  auth: firebaseApp.auth(),
  getNodeByPath: (path, action) => {
    return firebaseApp
      .database()
      .ref(path)
      .on("value", action);
  },
  setNodeByPath: (path, data) => {
    return firebaseApp
      .database()
      .ref(path)
      .set(data);
  },
  updateTableDataByID: data => {
    firebaseApp
      .database()
      .ref("tables/")
      .set(data);
  }
};
