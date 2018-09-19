import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {app} from "../firebase/firebase.js";
import {getObj} from "../helper/helper.js";

export const dispatch = (type, action) =>
  store.dispatch(Object.assign({}, {type: type}, action));

export const appReducer = (state, action) => {
  switch (action.type) {
    case "HANDLE_LOGIN": {
      return Object.assign({}, state, {currentUser: action.name});
    }
    case "STOP_LOADING": {
      return Object.assign({}, state, {isLoad: action.isLoad});
    }
    case "FETCH_TABLLE_DATA": {
      return Object.assign({}, state, {tables: action.tables});
    }
    case "ADD_USER_TO_TABLE": {
      // todo, detect, remove user from table
      let table = state.tables[action.id];
      let PLAYER_NUM = 4;
      let tablePlayerList = table.players ? table.players.slice() : [];
      if (tablePlayerList.length < PLAYER_NUM) {
        tablePlayerList.push(state.currentUser);
      }

      let tableWithUsers = getObj(
        action.id,
        Object.assign({}, table, {
          players: tablePlayerList
        }),
      );

      let tables = Object.assign({}, state.tables, tableWithUsers);
      app.updateTableDataByID(tableWithUsers);

      return Object.assign({}, state, {tables: tables});
    }
    case "REMOVE_USER_FROM_TABLE": {
      console.log("remove user");
    }
    case "ADD_NEW_DECK_TO_TABLE": {
      let table = state.tables[action.id];
      let tableWithNewCards = getObj(
        action.id,
        Object.assign({}, table, {
          cards: action.cards,
          isStart: action.isStart
        }),
      );

      console.log("tableWithNewCards", tableWithNewCards);
      let tables = Object.assign({}, state.tables, tableWithNewCards);
      app.updateTableDataByID(tableWithNewCards);
      return Object.assign({}, state, {table: tables});
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
    tables: [{tableId: 100}]
  },
  applyMiddleware(thunk),
);

app.getNodeByPath("tables", value => {
  return dispatch("FETCH_TABLLE_DATA", {tables: value.val()});
});
