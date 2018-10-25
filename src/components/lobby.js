import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {
  IndexRoute,
  BrowserRouter,
  Router,
  Route,
  Switch,
  Link
} from "react-router-dom";
import {EMPTY_SEAT} from "./constant.js";
import OpenTables from "./openTables.js";
import PlayingTables from "./playingTables.js";
import "../style/lobby.scss";
import openImg from "../images/open.svg";
import playImg from "../images/play.svg";
import Header from "./header.js";
import {Loading} from "./loading.js";

export const Lobby = ({
  isHeaderPanelClosed,
  getUserAuthInfo,
  currentUser,
  isLoad,
  tables,
  tableList
}) => {
  let open = 0,
    playing = 0;
  if (!isLoad) {
    return <Loading />;
  }
  return (
    <div>
      <Header
        isHeaderPanelClosed={isHeaderPanelClosed}
        getUserAuthInfo={getUserAuthInfo}
        currentUser={currentUser}
      />
      <div className="lobby">
        <div className="lobby-title">
          <h2>
            {" "}
                        鍛鍊腦力的最佳活動 <br />{" "}
            <span>支援多人連線，單機版電腦對戰模式</span>
          </h2>
        </div>
        <div className="table-lists">
          <div className="table-list-wrapper">
            <div className="table-num" />
            <div className="table-list-inner">
              <img src={openImg} />
              <OpenTables
                title={"揪咖打牌"}
                openBtn={true}
                tables={tables}
                currentUser={currentUser}
                open={true}
                tableList={tableList}
              />
            </div>
          </div>
          <div className="table-list-wrapper">
            <div className="table-num" />
            <div className="table-list-inner">
              <img src={playImg} />
              <PlayingTables
                tables={tables}
                title={"熱門牌桌"}
                openBtn={true}
                open={false}
                currentUser={currentUser}
                tableList={tableList}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
