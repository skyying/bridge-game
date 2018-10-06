import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {app} from "../firebase/firebase.js";
import {getObj} from "../helper/helper.js";
import {
  GAME_STATE,
  EMPTY_SEAT,
  DEFAULT_GAME,
  PLAYERS
} from "../components/constant.js";

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
    default:
      return state;
  }
};

export const store = createStore(
  appReducer,
  {
    currentUser: null,
    isLoad: false
  },
  applyMiddleware(thunk),
);

export const dispatchToDatabase = (type, action) => {
  switch (type) {
    case "CREATE_TABLE": {
      let timeStamp = new Date().getTime();
      if (action.tableNum > 0) {
        let players = PLAYERS.slice(0);
        players[0] = action.currentUser;
        let tableKey = app.getNewChildKey("tables");
        let newTable = {
          timeStamp: action.tableRef || timeStamp,
          gameState: 0,
          id: tableKey,
          linkId: action.tableRef || timeStamp,
          game: DEFAULT_GAME,
          players: players,
          ready: [false, false, false, false]
        };
        app.setNodeByPath(`tables/${tableKey}`, newTable);
      } else {
        // first table is create by system
        let tableKey = app.getNewChildKey("tables");
        let newTable = {
          timeStamp: action.tableRef || timeStamp,
          gameState: "join",
          id: tableKey,
          linkId: action.tableRef || new Date().getTime(),
          game: DEFAULT_GAME,
          players: PLAYERS,
          ready: [false, false, false, false]
        };
        app.setNodeByPath(`tables/${tableKey}`, newTable);
      }
      break;
    }
    case "CREATE_NEW_GAME": {
      let {table, tableId} = action;
      let tableData = Object.assign({}, table);
      let {record, game} = tableData;
      if (record) {
        record.push(game);
      } else {
        record = [game];
      }
      tableData.record = record;
      tableData.game = Object.assign({}, DEFAULT_GAME);
      tableData.ready = [false, false, false, false];
      app.updateTableDataByID(tableId, tableData);
      break;
    }
    case "READY_A_PLAYER": {
      // if all four player are ready,
      // start a new game automatically;
      let {table, playerIndex, tableId} = action;
      let path = `tables/${tableId}/ready/${playerIndex}`;
      app.setNodeByPath(path, true);

      // updateTimer
      app.updateTableGameDataByPath(
        `${tableId}/timeStamp/`,
        new Date().getTime(),
      );

      break;
    }
    case "ADD_NEW_DECK_TO_TABLE": {
      // todo, use high order function to wrap this
      // create a game
      let {cards, table, tableId} = action;
      let newGame = Object.assign({}, table.game, {
        cards: action.cards
      });

      app.updateTableDataByID(`${tableId}/game/`, newGame);
      break;
    }
    case "UPDATE_WINNER_CARD": {
      // todo, use high order function to wrap this
      let {tableId, table} = action;
      let game = Object.assign({}, table.game);

      let cards = game.cards;
      game.order = action.order;

      // update which player will draw first
      let targetCardIndex = cards.findIndex(
        card => card.value === action.winnerCard.value,
      );
      let winner = action.winnerCard;
      winner.isWin = true;
      game.deal = winner.player;
      cards[targetCardIndex] = winner;
      // 51 means the index in the card array , the n-52 cards is given
      if (action.order === 51) {
        game.isGameOver = true;
      }
      app.updateTableDataByID(`${tableId}/game/`, game);
      // app.updateTableDataByID(`${tableId}/ready/`, [
      //   false,
      //   false,
      //   false,
      //   false
      // ]);
      break;
    }
    case "UPDATE_CURRENT_TRICK": {
      // update this is how many trick players have been draw

      let {table, tableId, order, deal} = action;
      let {game} = table;
      app.updateTableGameDataByPath(`${tableId}/game/order/`, order);

      let cards = game.cards;

      let targetCardInex = cards.findIndex(
        card => card.value === action.value,
      );

      let currentCard = cards[targetCardInex];
      currentCard.order = order;

      // update deal order, who can draw card next
      app.updateTableGameDataByPath(`${tableId}/game/deal/`, deal);
      app.updateTableGameDataByPath(
        `${tableId}/timeStamp/`,
        new Date().getTime(),
      );

      // this card has been draw in nth trick
      // set current trick number to this card
      if (currentCard.trick === 0) {
        // update trick to current nth trick, e.g. players have play 4 tricks
        // so far, the maxTrick will be 5
        currentCard.trick = action.maxTrick;
        // record who has this card
        currentCard.player = (deal + 4 - 1) % 4;

        app.updateTableGameDataByPath(
          `${action.tableId}/game/cards/${targetCardInex}`,
          currentCard,
        );
      }
      break;
    }
    case "ADD_PLAYER_TO_TABLE": {
      let {table, currentUser, tableId} = action;
      let players = table.players.slice(0);
      let emptySeatIndex = players.findIndex(seat => seat === EMPTY_SEAT);
      if (emptySeatIndex >= 0) {
        players[emptySeatIndex] = currentUser;

        // let currentTableObj = getObj(action.id, currentTable);
        app.setNodeByPath(`tables/${tableId}/players/`, players);
      }
      break;
    }
    case "UPDATE_AUCTION": {
      // in order to detect if some user isn't online anymore
      // record current to database when a current user is deal
      app.updateTableGameDataByPath(
        `${action.tableId}/game/`,
        action.game,
      );
      app.updateTableGameDataByPath(
        `${action.tableId}/timeStamp/`,
        new Date().getTime(),
      );
      break;
    }
    default:
      return null;
  }
};

app.getNodeByPath("tables", value => {
  return dispatch("FETCH_TABLE_DATA", {tables: value.val()});
});
