import React from "react";
import PropTypes from "prop-types";
import {EMPTY_SEAT} from "./constant";
import {dispatchToDatabase} from "../reducer/reducer.js";
import "../style/ready-list.scss";
import {ThumbnailWithTag, WaitingThumbnail} from "./thumbnail";
import Deck from "../logic/deck.js";

const deal = (table, currentUser) => {
  if (!table) return;
  let deck = new Deck();
  dispatchToDatabase("START_GAME", {
    currentUser: currentUser,
    table: table,
    cards: deck.cards
  });
};

const checkReadyState = ready => {
  return ready.every(state => state === false);
};

const setReadyState = (table, currentUser, playerIndex) => {
  if (!table) return;
  dispatchToDatabase("READY_A_PLAYER", {
    playerIndex: playerIndex,
    table: table
  });
};

const JoinState = ({table, currentUser}) => {
  if (!table) {
    return null;
  }

  let {ready, players, playerInfo} = table;
  let playBtns = null;

  let thumbnails = players.map((player, index) => {
    let playerName;
    let size = 70;
    let offset = 0;

    if (playerInfo[player]) {
      playerName = playerInfo[player].displayName;
    }

    if (!playerName) {
      return (
        <div
          key={`join-plyaer-${index}`}
          className="player-ready-wrapper">
          <WaitingThumbnail size={size} />
          <span>等候中</span>
        </div>
      );
    }

    return (
      <div key={`join-player-${index}`} className="player-ready-wrapper">
        <ThumbnailWithTag
          isCurrentUser={players[index] === currentUser.uid}
          size={size}
          offset={offset}
          disabled={!ready[index]}
          name={playerName}
        />
        <span>{playerName}</span>
      </div>
    );
  });

  let currentUserCanPlay;
  let isTableOwner = currentUser.uid === players[0];

  if (players.includes(currentUser.uid)) {
    currentUserCanPlay = players.some(
      (player, i) => player === currentUser.uid && !ready[i]
    );

    playBtns = players.map((player, index) => {
      if (player === currentUser.uid && !ready[index]) {
        return (
          <div key={`playBtn-${index}`}>
            <br />
            <button
              style={{zIndex: 5}}
              onClick={() =>
                setReadyState(table, currentUser, index)
              }
              className="btn">
                            加入牌局
            </button>
          </div>
        );
      } else {
        return <div key={`playBtn-${index}`} />;
      }
    });
  }

  let startGame = (
    <button onClick={() => deal(table)} className="btn">
            開始牌局
    </button>
  );

  let roomId = `${table.linkId}`;
  let roomNum = "桌號 " + roomId.slice(roomId.length - 3, roomId.length);
  let notesText = isTableOwner
    ? "按下方按鈕立即開始牌局"
    : "等候其他玩家中...";

  return (
    <div className="player-ready-list">
      <div className="player-ready-list-inner">
        <h3>
          <span>{roomNum}</span>
        </h3>
        <div className="row"> {thumbnails}</div>
        {!currentUserCanPlay && (
          <div className="waiting-info">{notesText}</div>
        )}
        <div className="btn-wrapper">
          {currentUserCanPlay && playBtns}
          {isTableOwner && startGame}
        </div>
      </div>
    </div>
  );
};

export default JoinState;
