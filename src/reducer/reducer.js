import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { app } from "../firebase/firebase.js";
import { getObj } from "../helper/helper.js";

export const dispatch = (type, action) =>
  store.dispatch(Object.assign({}, { type: type }, action));

export const appReducer = (state, action) => {
  switch (action.type) {
    case "HANDLE_LOGIN": {
      return Object.assign({}, state, { currentUser: action.name });
    }
    case "STOP_LOADING": {
      return Object.assign({}, state, { isLoad: action.isLoad });
    }
    case "FETCH_TABLLE_DATA": {
      return Object.assign({}, state, { tables: action.tables });
    }
    case "ADD_USER_TO_TABLE": {
      let table = state.tables[action.id];
      let PLAYER_NUM = 4;
      console.log("ADD_USER_TO_TABLE");
      console.log("table.players", table.players);
      let tablePlayerList = table.players ? table.players.slice() : [];
      if (tablePlayerList.length < PLAYER_NUM) {
        tablePlayerList.push(state.currentUser);
      }

      let tableWithUsers = getObj(
        action.id,
        Object.assign({}, table, {
          players: tablePlayerList
        })
      );
      console.log("tableWithUsers", tableWithUsers);

      let tables = Object.assign({}, state.tables, tableWithUsers);
      app.updateTableDataByID(tableWithUsers);

      return Object.assign({}, state, { tables: tables });
    }
    default:
      return state;
  }
};

export const store = createStore(
  appReducer,
  {
    currentUser: null,
    isLoad: false,
    tables: [{ tableId: 100 }, { tableId: 101 }]
  },
  applyMiddleware(thunk)
);

app.getNodeByPath("tables", value => {
  return dispatch("FETCH_TABLLE_DATA", { tables: value.val() });
});
