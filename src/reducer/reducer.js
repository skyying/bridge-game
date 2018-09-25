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
          players: [
            "1111111111",
            "2222222222",
            "33333333333",
            EMPTY_SEAT
          ]
        }
      ]
    ]
  },
  applyMiddleware(thunk),
);

export const dispatchToDatabase = (type, action) => {
  switch (type) {
    case "RESET_GAME": {
      // create a game
      app.updateTableDataByID(action.id, action.data);
      break;
    }
    case "ADD_NEW_DECK_TO_TABLE": {
      // todo, use high order function to wrap this
      // create a game
      let currentTable = action.table.map(game =>
        Object.assign({}, game),
      );
      let currentGame = currentTable.pop();
      let newGame = {
        cards: action.cards,
        deal: -1,
        bid: action.bid,
        order: -1
      };
      let game = Object.assign({}, currentGame, newGame);
      currentTable.push(game);

      let table = getObj(action.id, currentTable);
      app.updateTableDataByID(table);
      break;
    }
    case "UPDATE_WINNER_CARD": {
      // todo, use high order function to wrap this
      let currentTable = action.table.map(game =>
        Object.assign({}, game),
      );
      let currentGame = currentTable.pop();

      let cards = currentGame.cards;

      // update which player will draw first
      let targetCardIndex = cards.findIndex(
        card => card.value === action.winnerCard.value,
      );
      let winner = action.winnerCard;

      winner.isWin = true;
      cards[targetCardIndex] = winner;

      currentTable.push(currentGame);
      let table = getObj(action.id, currentTable);
      app.updateTableDataByID(table);
      break;
    }
    case "UPDATE_CURRENT_TRICK": {
      // update this is how many trick players have been draw

      let currentTable = action.table.map(game =>
        Object.assign({}, game),
      );

      let gameIndex = currentTable.length - 1;
      let currentGame = currentTable.pop();
      let cards = currentGame.cards;

      let targetCardInex = cards.findIndex(
        card => card.value === action.value,
      );

      let currentCard = cards[targetCardInex];
      currentCard.order = action.order;

      // update deal order, who can draw card next
      app.updateTableGameDataByPath(
        `${action.id}/${gameIndex}/deal`,
        action.deal,
      );

      // this card has been draw in nth trick
      // set current trick number to this card
      if (currentCard.trick === 0) {
        // save card data to database
        app.updateTableGameDataByPath(
          `${action.id}/${gameIndex}/order`,
          action.order,
        );

        // update trick to current nth trick, e.g. players have play 4 tricks
        // so far, the maxTrick will be 5
        currentCard.trick = action.maxTrick;

        app.updateTableGameDataByPath(
          `${action.id}/${gameIndex}/cards/${targetCardInex}/`,
          currentCard,
        );
      }

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
    case "UPDATE_AUCTION": {
      app.updateTableGameDataByPath(
        `${action.id}/${action.gameIndex}/`,
        action.game,
      );
    }
    default:
      return null;
  }
};

app.getNodeByPath("tables", value => {
  return dispatch("FETCH_TABLE_DATA", {tables: value.val()});
});
