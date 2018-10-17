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
    this.timeInterval = 1000;
    this.frequency = 10; // update frequency per sec;
    // update how many persec to current progress
    this.progressInterval = Math.floor(
      TIMER.join / Math.floor(this.timeInterval / this.frequency)
    );
    this.state = {
      progress: 0,
      timesUp: false
    };
    this.duration = TIMER.join;
    this.setReadyState = this.setReadyState.bind(this);
    this.countDownTimer = this.countDownTimer.bind(this);
    this.timer = setInterval(
      this.countDownTimer,
      Math.floor(this.timeInterval / this.frequency)
    );
  }
  countDownTimer() {
    if (this.state.progress < TIMER.join) {
      this.setState({
        progress: this.state.progress + this.progressInterval
      });
    }
    if (this.state.progress >= TIMER.join) {
      clearInterval(this.timer);
      this.setState({timesUp: true});
    }
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

    if (this.state.timesUp && !isAllPlayerReady) {
      return <div> I am loading </div>;
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
    let currentVAl = this.state.progress / TIMER.join;
    return (
      <div className="player-ready-list">
        <div className="player-ready-list-inner">
          <div className="row"> {thumbnails}</div>
          {currentUserCanPlay && (
            <div className="btn-wrapper">{playBtns}</div>
          )}
          <div className="progress-panel">
            <Progress
              totalWidth={200}
              currentWidth={currentVAl * 200 - 10 < 0 ? currentVAl * 200 : currentVAl * 200 - 10 }
            />
          </div>
        </div>
      </div>
    );
  }
}

// <div className="notes">等待加入中...</div>
