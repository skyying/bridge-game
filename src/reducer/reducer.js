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

export const dispatchToDatabase = (type, action) => {
  switch (type) {
    case "ADD_NEW_DECK_TO_TABLE": {
      // create a game
      let currentTable = action.table.slice(0);
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
      app.updateTableDataByID(table);
      break;
    }
    case "ADD_PLAYER_TO_TABLE": {
      let currentTable = action.table.map(game =>
        Object.assign({}, game),
      );
      let currentGame = currentTable.pop();
      if (!currentGame.players) {
        currentGame.players = [
          EMPTY_SEAT,
          EMPTY_SEAT,
          EMPTY_SEAT,
          EMPTY_SEAT
        ];
      }
      let emptyIndex = currentGame.players.indexOf(EMPTY_SEAT);
      if (emptyIndex >= 0) {
        // if there are any empty seats, fill them first, else
        // fill them by squence

        currentGame.players[emptyIndex] = action.currentUser;
      }
      currentTable.push(currentGame);
      let currentTableObj = getObj(action.id, currentTable);

      // udpate player data to database
      app.updateTableDataByID(currentTableObj);
      break;
    }
    default:
      return null;
  }
};

app.getNodeByPath("tables", value => {
  return dispatch("FETCH_TABLE_DATA", {tables: value.val()});
});
