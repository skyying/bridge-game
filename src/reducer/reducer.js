import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {app} from "../firebase/firebase.js";
import {getObj} from "../helper/helper.js";
import {EMPTY_SEAT} from "../components/constant.js";

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
