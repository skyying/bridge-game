import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {EMPTY_SEAT, TIMER} from "./constant.js";
import {getRandomKey} from "../helper/helper.js";
import {dispatch, dispatchToDatabase} from "../reducer/reducer.js";
import "../style/ready-list.scss";
import {ThumbnailWithTag, WaitingThumbnail} from "./thumbnail.js";
import {Progress} from "./progress.js";
export default class PlayerReadyList extends React.Component {
  constructor(props) {
    super(props);
    this.setReadyState = this.setReadyState.bind(this);
    this.checkReadyState = this.checkReadyState.bind(this);
    this.startGame = this.startGame.bind(this);
  }
  startGame() {
    if (!this.props.table) return;
    dispatchToDatabase("START_GAME", {
      currentUser: this.props.currentUser,
      table: this.props.table
    });
  }
  checkReadyState() {
    let {table, currentUser} = this.props;
    let {game, ready, players, playerInfo} = table;
    return ready.every(player => player === false);
  }
  setReadyState(playerIndex) {
    let {currentUser, table} = this.props;
    if (!table) return;
    let {game, gameState} = table;
    let players = table.players.slice(0);
    dispatchToDatabase("READY_A_PLAYER", {
      playerIndex: playerIndex,
      table: table
    });
  }
  render() {
    let {table, currentUser} = this.props;
    let {game, ready, players, playerInfo} = table;

    if (!game) {
      return <div> No game data </div>;
    }

    let {isGameOver, order} = game;
    let isAnyEmptySeat = players.some(seat => seat === EMPTY_SEAT);
    let isAllPlayerReady = ready.every(player => player === true);

    // if need to sho playerReadylist
    let showPlayerReadyList =
            (isAnyEmptySeat && order < 0) || !isAllPlayerReady;

    if (!showPlayerReadyList) {
      return null;
    }

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
        <div
          key={`join-player-${index}`}
          className="player-ready-wrapper">
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
                onClick={() => this.setReadyState(index)}
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
      <button onClick={this.startGame} className="btn">
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
  }
}
