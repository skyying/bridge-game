import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {EMPTY_SEAT, TIMER} from "./constant.js";
import {getRandomKey} from "../helper/helper.js";
import {dispatch, dispatchToDatabase} from "../reducer/reducer.js";
import "../style/ready-list.scss";
import {Thumbnail, WaitingThumbnail} from "./thumbnail.js";
import {Progress} from "./progress.js";
export default class PlayerReadyList extends React.Component {
  constructor(props) {
    super(props);
    this.timeInterval = 20000;
    this.createTime = this.props.startTime;
    this.frequency = 10; // update frequency per sec;
    // update how many persec to current progress
    // this.progressInterval = Math.floor(
    //   TIMER.join / Math.floor(this.timeInterval / this.frequency)
    // );
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx");
    console.log("renew a constructor");
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx");
    // let timeStamp = new Date().getTime();
    this.state = {
      progress: new Date().getTime() - this.createTime
    };
    // Math.floor(this.timeInterval / this.frequency)
    // this.duration = TIMER.join;
    this.setReadyState = this.setReadyState.bind(this);
    this.countDownTimer = this.countDownTimer.bind(this);
    this.checkReadyState = this.checkReadyState.bind(this);
    this.timer = setInterval(this.countDownTimer, this.frequency);
  }
  componentDidMount() {
    this.isMount = true;
  }
  componentWillUnmount() {
    this.isMount = false;
  }
  countDownTimer() {
    console.log("count down");
    let createTime = this.createTime;
    let progress = new Date().getTime() - this.createTime;
    if (progress < this.timeInterval) {
      this.setState({
        progress: progress
      });
    } else {
      new Promise((resolve, reject) => {
        clearInterval(this.timer);
        resolve("cleard");
        console.log(" in promise, this is ");
      }).then(val => {
        if (this.isMount && this.createTime !== createTime) {
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
    let {game} = table;
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
      return <div> no game data </div>;
    }

    let {isGameOver, order} = game;
    let isEmptySeat = players.some(seat => seat === EMPTY_SEAT);
    let isAllPlayerReady = ready.every(player => player === true);

    // if need to sho playerReadylist
    let showPlayerReadyList =
            (isEmptySeat && order < 0) || !isAllPlayerReady;

    if (!showPlayerReadyList) {
      return null;
    }
    let playBtns = null;

    if (this.state.timesUp && ready.some(player => player === true)) {
      return <div>all player is ready, waiting for poker</div>;
    }
    if (this.state.timesUp && ready.every(player => player === false)) {
      return <div> no one wants to play, redirect to lobby... </div>;
    }
    let thumbnails = players.map((player, index) => {
      let playerName;
      let size = 70;
      if (playerInfo[player]) {
        playerName = playerInfo[player].displayName;
      }
      if (!playerName) {
        return (
          <WaitingThumbnail
            stop={this.state.progress >= TIMER.join}
            key={`join-plyaer-${index}`}
            size={size}
          />
        );
      }
      return (
        <div
          key={`join-player-${index}`}
          className="player-ready-wrapper">
          <Thumbnail
            size={size}
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

    let totalWidth = 200;
    let unit = this.timeInterval / totalWidth;

    let currentVal = Math.floor(
      (this.state.progress / this.timeInterval) * 200
    );

    return (
      <div className="player-ready-list">
        <div className="player-ready-list-inner">
          <div className="row"> {thumbnails}</div>
          {currentUserCanPlay && (
            <div className="btn-wrapper">{playBtns}</div>
          )}
          <div className="progress-panel">
            <Progress totalWidth={200} currentWidth={currentVal} />
          </div>
        </div>
      </div>
    );
  }
}

// <div className="notes">等待加入中...</div>
