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
    case "FETCH_TABLE_DATA": {
      // tables is an array, query table by index
      return Object.assign({}, state, {tables: action.tables});
    }
    case "ADD_PLAYER_TO_TABLE": {
      // todo,remove user from table
      // todo, disconnected issue, should invoke a timer 
      // if someone is disconntected

      let currentTable = state.tables[action.id].slice(0);

      let PLAYER_NUM = 4;
      // copy data for current game
      let currentGame = currentTable.pop();

      console.log("currentGame", currentGame);
      console.log("shuld have value");
      if (!currentGame.players) {
        currentGame.players = [-1, -1, -1, -1];
      }
      // if current table still have seats and its a new player, let them in;
      let isUserNotInPlayerList =
                currentGame.players.indexOf(state.currentUser) === -1;
      console.log("isUserNotInPlayerList", isUserNotInPlayerList);
      let emptyIndex = currentGame.players.indexOf(-1);
      if (emptyIndex >= 0 && isUserNotInPlayerList) {
        // if there are empty seats, fill them first, else fill them by squence
        currentGame.players[emptyIndex] = state.currentUser.slice();
      }

      currentTable.push(currentGame);
      let tablesCopy = state.tables.slice(0);
      tablesCopy[action.id] = currentTable;

      let currentTableObj = getObj(action.id, currentTable);
      app.updateTableDataByID(currentTableObj);
      return Object.assign({}, state, {tables: tablesCopy});
    }
    case "ADD_NEW_DECK_TO_TABLE": {
      // create a game
      let currentTable = state.tables[action.id].slice(0);
      let currentGame = currentTable.pop();
      let newGame = {
        cards: action.cards,
        result: [0, 0],
        deal: 0,
        bid: action.bid
      };

      let game = Object.assign({}, currentGame, newGame);
      currentTable.push(game);

      let table = getObj(action.id, currentTable);
      // data object for changed table

      let tablesData = Object.assign({}, state.tables, table);
      app.updateTableDataByID(table);
      return Object.assign({}, state, {tables: tablesData});
    }
    case "UPDATE_CURRENT_TRICK": {
      let currentTable = state.tables[action.id].slice(0);
      let currentGame = currentTable.pop();
      let cards = currentGame.cards;
      console.log("here");
      console.log(cards);
      return Object.assign({}, state, state);
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
    tables: [
      [
        {
          cards: [{trick: 0}, {trick: 1}],
          players: ["player1"],
          result: [0, 0]
        },
        {
          cards: [{trick: 0}, {trick: 1}],
          players: ["player2"],
          result: [0, 0]
        }
      ]
    ]
  },
  applyMiddleware(thunk),
);

app.getNodeByPath("tables", value => {
  return dispatch("FETCH_TABLE_DATA", {tables: value.val()});
});
