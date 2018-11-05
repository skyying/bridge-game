import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import Database from "../firebase";
import {
  GAME_STATE,
  DEFAULT_GAME,
  PLAYERS,
  EMPTY_SEAT,
  ROBOT_NAME
} from "../components/constant";

// handle state of whole application
export const dispatch = (type, action) =>
  store.dispatch(Object.assign({}, {type: type}, action));
export const appReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_USER_INFO": {
      if (!action) return;
      return Object.assign({}, state, {
        user: action.user
      });
    }
    case "UPDATE_USER_LIST": {
      return Object.assign({}, state, {
        userList: action.userList
      });
    }
    case "TOGGLE_SIDEBAR_PANEL": {
      return Object.assign({}, state, {
        isSidebarPanelShown: action.isSidebarPanelShown
      });
    }
    case "TOGGLE_HEADER_PANEL": {
      let current = state.isHeaderPanelClosed;
      if (action.isToggle) {
        return Object.assign({}, state, {
          isHeaderPanelClosed: !current
        });
      }
      return Object.assign({}, state, {
        isHeaderPanelClosed: true
      });
    }
    case "UPDATE_LOADING_STATE": {
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
      let {table} = action;
      let tables = state.tables;
      let updatedTables = Object.assign({}, tables);
      updatedTables[table.id] = table;
      return Object.assign({}, state, {tables: updatedTables});
    }
    case "UPDATE_CURRENT_TABLE_ID": {
      return Object.assign({}, state, {
        currentTableId: action.currentTableId
      });
    }
    case "FETCH_TABLE_LIST": {
      // tables is an array, query table by index
      return Object.assign({}, state, {tableList: action.tableList});
    }
    default:
      return state;
  }
};

// communcate with database
export const dispatchToDatabase = (type, action) => {
  switch (type) {
    case "CREATE_USER": {
      Database.setNodeByPath(`/users/${action.uid}`, action.userInfo);
      break;
    }
    case "CREATE_TABLE": {
      let {currentUser, linkId} = action;
      if (!action.currentUser.uid) {
        console.log("user is not login");
        return;
      }
      let timeStamp = new Date().getTime();
      let players = PLAYERS.slice(0);
      let newPlayerInfo = {};
      let uidKey = `${currentUser.uid}`;
      newPlayerInfo[uidKey] = {displayName: currentUser.displayName};
      players[0] = action.currentUser.uid;
      let tableKey = Database.getNewChildKey("tables");
      let newLinkId = linkId || timeStamp;
      let newTable = {
        timeStamp: newLinkId,
        createTime: newLinkId,
        gameState: GAME_STATE.join,
        id: tableKey,
        linkId: newLinkId,
        game: DEFAULT_GAME,
        playerInfo: Object.assign(
          {},
          {
            "C1-robot": {displayName: `C1${ROBOT_NAME}`},
            "C2-robot": {displayName: `C2${ROBOT_NAME}`},
            "C3-robot": {displayName: `C3${ROBOT_NAME}`},
            "-1": {displayName: ""}
          },
          newPlayerInfo
        ),
        players: players,
        ready: [true, false, false, false]
      };
      Database.setNodeByPath(`tables/${tableKey}`, newTable);
      Database.setTableListData(newLinkId, {
        id: tableKey,
        players: players,
        playerInfo: Object.assign(
          {},
          {
            "C1-robot": {displayName: "C1-robot"},
            "C2-robot": {displayName: "C2-robot"},
            "C3-robot": {displayName: "C3-robot"},
            "-1": {displayName: ""}
          },
          newPlayerInfo
        )
      });
      break;
    }

    case "CREATE_NEW_GAME": {
      let {table} = action;
      let {players} = table;
      let tableData = Object.assign({}, table);
      let {record, game} = tableData;
      if (record) {
        record.push(game);
      } else {
        record = [game];
      }

      let newPlayers = players.map(
        player => (player.includes(ROBOT_NAME) ? EMPTY_SEAT : player)
      );
      // reset table
      let timeStamp = new Date().getTime();
      tableData.record = record;
      tableData.createTime = timeStamp;
      tableData.game = Object.assign({}, DEFAULT_GAME);
      tableData.ready = [true, false, false, false];
      tableData.timeStamp = timeStamp;
      tableData.gameState = GAME_STATE.join;
      tableData.players = newPlayers;
      Database.setNodeByPath(`tables/${tableData.id}`, tableData);
      break;
    }
    case "START_GAME": {
      let {table, cards} = action;
      let tableData = Object.assign({}, table);

      // add new deck to table
      let {players, game} = tableData;
      game.cards = cards;

      // add avatar to empty seats
      let avatar = [1, 2, 3];
      let index = 0;
      let avaters = players.map(player => {
        return player === EMPTY_SEAT
          ? `C${avatar[index++]}${ROBOT_NAME}`
          : player;
      });

      // compose new game data for current table
      let newTable = Object.assign(
        {},
        tableData,
        {game: game},
        {ready: [true, true, true, true]},
        {players: avaters},
        {gameState: GAME_STATE.auction},
        {timeStamp: new Date().getTime()}
      );

      Database.setNodeByPath(`tables/${newTable.id}`, newTable);
      Database.setNodeByPath(`tableList/${table.linkId}`, {
        id: table.id,
        players: avaters,
        playerInfo: table.playerInfo
      });
      break;
    }
    case "READY_A_PLAYER": {
      let {table, playerIndex} = action;
      let updateTable = Object.assign({}, table);
      updateTable.ready[playerIndex] = true;

      // batch update table, for client side usage
      if (updateTable.ready.every(state => state === true)) {
        updateTable.gameState = GAME_STATE.auction;
      }

      Database.setNodeByPath(`tables/${table.id}`, updateTable);
      break;
    }
    case "UPDATE_TABLE_TIMESTAMP": {
      Database.setNodeByPath(
        `tables/${action.id}/timeStamp/`,
        new Date().getTime()
      );
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
      Database.updateTableDataByID(`${table.id}/game/`, game);
      if (action.order === 51) {
        Database.setNodeByPath(
          `tables/${table.id}/gameState/`,
          GAME_STATE.gameover
        );
      }
      break;
    }
    case "UPDATE_CURRENT_TRICK": {
      // update this is how many trick players have been draw
      let {table, order, deal} = action;
      let {game} = table;
      Database.updateTableGameDataByPath(
        `${table.id}/game/order/`,
        order
      );

      let cards = game.cards;

      let targetCardInex = cards.findIndex(
        card => card.value === action.value
      );

      let currentCard = cards[targetCardInex];
      currentCard.order = order;

      // update deal order, who can draw card next
      Database.updateTableGameDataByPath(`${table.id}/game/deal/`, deal);
      Database.updateTableGameDataByPath(
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

        Database.updateTableGameDataByPath(
          `${table.id}/game/cards/${targetCardInex}`,
          currentCard
        );
      }
      break;
    }
    case "ADD_VIEWER_TO_TABLE": {
      let {currentUser, table, color} = action;
      let {linkId, id} = table;
      Database.setNodeByPath(
        `tables/${id}/viewers/${currentUser.uid}`,
        color
      );
      Database.updateTableGameDataByPath(
        `${id}/timeStamp/`,
        new Date().getTime()
      );
      // if anyone join this table, update data to table list
      break;
    }
    case "ADD_PLAYER_TO_TABLE": {
      let {currentUser, table, emptySeatIndex, color} = action;

      let {linkId, id, players} = table;

      Database.setNodeByPath(
        `tables/${id}/players/${emptySeatIndex}`,
        currentUser.uid
      );
      Database.setNodeByPath(
        `tables/${id}/playerInfo/${currentUser.uid}`,
        {
          displayName: currentUser.displayName
        }
      );

      Database.setNodeByPath(
        `tables/${id}/viewers/${currentUser.uid}`,
        color
      );
      // if anyone join this table, update data to table list
      let updatePlayers = players.slice(0);
      updatePlayers[emptySeatIndex] = currentUser.uid;
      Database.setNodeByPath(
        `tableList/${linkId}/players`,
        updatePlayers
      );
      Database.setNodeByPath(
        `tableList/${linkId}/playerInfo/${currentUser.uid}`,
        {displayName: currentUser.displayName}
      );
      Database.updateTableGameDataByPath(
        `${id}/timeStamp/`,
        new Date().getTime()
      );

      break;
    }
    case "UPDATE_AUCTION": {
      // in order to detect if some user isn't online anymore
      // record current to database when a current user is deal
      Database.updateTableGameDataByPath(
        `${action.table.id}/game/`,
        action.game
      );
      Database.updateTableGameDataByPath(
        `${action.table.id}/timeStamp/`,
        new Date().getTime()
      );
      break;
    }
    case "SEND_MESSAGE_TO_CHATROOM": {
      let {message, currentUser, table} = action;
      let time = new Date().getTime();
      let newMessage = {};
      newMessage.isPlayer = table.players.some(
        player => player === currentUser.uid
      );
      newMessage.content = action.message;
      newMessage.uid = currentUser.uid;
      newMessage.displayName = currentUser.displayName;
      Database.setNodeByPath(
        `chatroom/${table.id}/message/${time}/`,
        newMessage
      );
    }
    default:
      return null;
  }
};

Database.getNodeByPath("tableList", value => {
  return dispatch("FETCH_TABLE_LIST", {tableList: value.val()});
});

Database.getNodeByPath("users", value => {
  return dispatch("UPDATE_USER_LIST", {userList: value.val()});
});

export const store = createStore(
  appReducer,
  {
    currentUser: null,
    isLoad: false,
    tables: {},
    currentTableId: null,
    isSidebarPanelShown: true,
    isHeaderPanelClosed: true
  },
  applyMiddleware(thunk)
);

Database.getCurrentUser().then(user => {
  dispatch("UPDATE_LOADING_STATE", {isLoad: true});
  dispatch("UPDATE_USER_INFO", user);
});
