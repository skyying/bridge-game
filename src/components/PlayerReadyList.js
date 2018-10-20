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
    this.timeInterval = 15000;
    this.frequency = 10; // update frequency per sec;
    // let timeStamp = new Date().getTime();
    this.state = {
      progress: new Date().getTime() - this.props.table.createTime
    };
    this.setReadyState = this.setReadyState.bind(this);
    this.countDownTimer = this.countDownTimer.bind(this);
    this.checkReadyState = this.checkReadyState.bind(this);
    this.timer = setInterval(this.countDownTimer, this.frequency);
  }

  componentDidMount() {
    this.isMount = true;
    let diffRange = new Date().getTime() - this.props.createTime;

    if (this.isMount && diffRange >= this.timeInterval) {
      this.setState({
        progress: new Date().getTime() - this.props.table.createTime
      });
    }
  }
  componentWillUnmount() {
    this.isMount = false;
  }
  componentDidUpdate(prevProps) {
    if (this.props.createTime !== prevProps.createTime) {
      this.state.progress =
                new Date().getTime() - this.props.table.createTime;
    }
  }
  countDownTimer() {
    let createTime = this.props.table.createTime;
    let diffRange = new Date().getTime() - this.props.table.createTime;
    if (this.isMount && diffRange < this.timeInterval) {
      this.setState({
        progress: diffRange
      });
    } else {
      new Promise((resolve, reject) => {
        clearInterval(this.timer);
        resolve("cleard");
      }).then(val => {
        if (
          this.isMount &&
                    this.props.table.createTime !== createTime
        ) {
          this.setState({timesUp: true});
        }
      });
    }
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

    let totolProgress = 200;

    let currentVal = Math.floor(
      (this.state.progress / this.timeInterval) * totolProgress
    );

    let isTimesUp = currentVal >= totolProgress - 1;

    let thumbnails = players.map((player, index) => {
      let playerName;
      let size = 70;
      let offset = 0;

      if (playerInfo[player]) {
        playerName = playerInfo[player].displayName;
      }

      if (!playerName) {
        return (
          <WaitingThumbnail
            stop={isTimesUp}
            key={`join-plyaer-${index}`}
            size={size}
          />
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

    if (players.includes(currentUser.uid)) {
      currentUserCanPlay = players.some(
        (player, index) => player === currentUser.uid && !ready[index]
      );
      playBtns = players.map((player, index) => {
        if (player === currentUser.uid && !ready[index]) {
          return (
            <div key={`playBtn-${index}`}>
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

    let progressState = (
      <Progress totalWidth={totolProgress} currentWidth={currentVal} />
    );
    if (isTimesUp) {
      if (ready.some(player => player === true)) {
        progressState = <div>牌桌準備中...</div>;
      } else {
        progressState = <div>沒人加入，即將返回大廳...</div>;
      }
    }
    let roomId = `${table.linkId}`;
    let roomNum = "桌號 " + roomId.slice(roomId.length - 3, roomId.length);

    return (
      <div className="player-ready-list">
        <div className="player-ready-list-inner">
          <h3>
            <span>{roomNum}</span>
          </h3>
          <div className="row"> {thumbnails}</div>
          {!isTimesUp &&
                        currentUserCanPlay && (
            <div className="btn-wrapper">{playBtns}</div>
          )}
          <div className="progress-panel">{progressState}</div>
        </div>
      </div>
    );
  }
}
