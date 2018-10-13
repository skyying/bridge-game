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
    case "UPDATE_CHAT_ROOM": {
      return Object.assign({}, state, {chatroom: action.chatroom});
    }
    case "UPDATE_TABLE_DATA": {
      let {id, table} = action;
      let tables = state.tables;
      let updatedTables = Object.assign({}, tables);
      updatedTables[id] = table;
      return Object.assign({}, state, {tables: updatedTables});
    }
    case "FETCH_TABLE_LIST": {
      // tables is an array, query table by index
      return Object.assign({}, state, {tableList: action.tableList});
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
    tables: {}
  },
  applyMiddleware(thunk)
);

export const dispatchToDatabase = (type, action) => {
  switch (type) {
    case "CREATE_TABLE": {
      let timeStamp = new Date().getTime();
      let players = PLAYERS.slice(0);
      players[0] = action.currentUser;
      let tableKey = app.getNewChildKey("tables");
      let linkId = action.tableRef || timeStamp;
      let newTable = {
        timeStamp: linkId,
        gameState: GAME_STATE.join,
        id: tableKey,
        linkId: linkId,
        game: DEFAULT_GAME,
        players: players,
        ready: [false, false, false, false]
      };
      app.setNodeByPath(`tables/${tableKey}`, newTable);
      app.setTableListData(linkId, {
        id: tableKey
      });
      break;
    }

    case "CREATE_NEW_GAME": {
      let {table} = action;
      let tableData = Object.assign({}, table);
      let {record, game} = tableData;
      if (record) {
        record.push(game);
      } else {
        record = [game];
      }
      // reset table
      tableData.record = record;
      tableData.game = Object.assign({}, DEFAULT_GAME);
      tableData.ready = [false, false, false, false];
      tableData.timeStamp = new Date().getTime();
      tableData.gameState = GAME_STATE.join;
      app.updateTableDataByID(tableData.id, tableData);
      break;
    }
    case "READY_A_PLAYER": {
      let {table, playerIndex} = action;
      let path = `tables/${table.id}/ready/${playerIndex}`;
      app.setNodeByPath(path, true);
      // updateTimer
      app.updateTableGameDataByPath(
        `${table.id}/timeStamp/`,
        new Date().getTime()
      );
      break;
    }
    case "ADD_NEW_DECK_TO_TABLE": {
      // todo, use high order function to wrap this
      // create a game
      let {cards, table} = action;
      let newGame = Object.assign({}, table.game, {
        cards: cards
      });

      console.log("cards", cards);
      app.updateTableDataByID(`${table.id}/game/`, newGame);
      console.log("should update cards");
      break;
    }
    case "UPDATE_WINNER_CARD": {
      // todo, use high order function to wrap this
      let {table} = action;
      let game = Object.assign({}, table.game);

      let cards = game.cards;
      game.order = action.order;

      // update which player will draw first
      let targetCardIndex = cards.findIndex(
        card => card.value === action.winnerCard.value
      );
      let winner = action.winnerCard;
      winner.isWin = true;
      game.deal = winner.player;
      cards[targetCardIndex] = winner;
      // 51 means the index in the card array , the n-52 cards is given
      if (action.order === 51) {
        game.isGameOver = true;
      }
      app.updateTableDataByID(`${table.id}/game/`, game);
      break;
    }
    case "UPDATE_CURRENT_TRICK": {
      // update this is how many trick players have been draw

      let {table, order, deal} = action;
      let {game} = table;
      app.updateTableGameDataByPath(`${table.id}/game/order/`, order);

      let cards = game.cards;

      let targetCardInex = cards.findIndex(
        card => card.value === action.value
      );

      let currentCard = cards[targetCardInex];
      currentCard.order = order;

      // update deal order, who can draw card next
      app.updateTableGameDataByPath(`${table.id}/game/deal/`, deal);
      app.updateTableGameDataByPath(
        `${table.id}/timeStamp/`,
        new Date().getTime()
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
          `${table.id}/game/cards/${targetCardInex}`,
          currentCard
        );
      }
      break;
    }
    case "ADD_VIEWER_TO_TABLE": {
      console.log("in add_player to table reducer");
      let {currentUser, table, color} = action;
      let {linkId, id} = table;
      app.setNodeByPath(`tables/${id}/viewers/${currentUser}`, color);
      // app.updateTableGameDataByPath(
      //   `${id}/timeStamp/`,
      //   new Date().getTime()
      // );
      // if anyone join this table, update data to table list
      break;
    }
    case "ADD_PLAYER_TO_TABLE": {
      let {currentUser, table, emptySeatIndex, color} = action;
      let {linkId, id, players} = table;

      app.setNodeByPath(
        `tables/${id}/players/${emptySeatIndex}`,
        currentUser
      );
      app.setNodeByPath(`tables/${id}/viewers/${currentUser}`, color);
      app.updateTableGameDataByPath(
        `${id}/timeStamp/`,
        new Date().getTime()
      );

      // if anyone join this table, update data to table list
      let updatePlayers = players.slice(0);
      updatePlayers[emptySeatIndex] = currentUser;
      app.setNodeByPath(`tableList/${linkId}/players`, updatePlayers);
      break;
    }
    case "UPDATE_AUCTION": {
      // in order to detect if some user isn't online anymore
      // record current to database when a current user is deal
      app.updateTableGameDataByPath(
        `${action.table.id}/game/`,
        action.game
      );
      app.updateTableGameDataByPath(
        `${action.table.id}/timeStamp/`,
        new Date().getTime()
      );
      break;
    }
    case "SEND_MESSAGE_TO_CHATROOM": {
      let {message, currentUser, table} = action;
      let time = new Date().getTime();
      let newMessage = {};
      newMessage.content = action.message;
      newMessage.user = currentUser;
      app.setNodeByPath(
        `chatroom/${table.id}/message/${time}/`,
        newMessage
      );
    }
    default:
      return null;
  }
};

// app.getNodeByPathOnce("tables", value => {
//   return dispatch("FETCH_TABLE_DATA", {tables: value.val()});
// });

app.getNodeByPath("tableList", value => {
  return dispatch("FETCH_TABLE_LIST", {tableList: value.val()});
});
