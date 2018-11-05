import React from "react";
import PropTypes from "prop-types";
import OpenTables from "./tableList/openTables.js";
import PlayingTables from "./tableList/playingTables.js";
import "../style/lobby.scss";
import openImg from "../images/open.svg";
import playImg from "../images/play.svg";
import Header from "./header";
import Loading from "./common/loading.js";

/*
 * A page component display two table list;
 * @param isHeaderPanelClosed, bool, if header user panel closed or nto
 * @param isLoad, bool, if loaing is over
 */
const Lobby = ({
  isHeaderPanelClosed,
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
        currentUser={currentUser}
      />
      <div className="lobby">
        <div className="lobby-title">
          <h2>
                        Your best brain gym<br />
            <span>A multiplayer online bridge game</span>
          </h2>
        </div>
        <div className="table-lists">
          <div className="table-list-wrapper">
            <div className="table-num" />
            <div className="table-list-inner">
              <img src={openImg} />
              <OpenTables
                title={"Join a table to play"}
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
                title={"Popular tables"}
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

Lobby.propTypes = {
  isLoad: PropTypes.bool,
  tables: PropTypes.object,
  tableList: PropTypes.object,
  currentUser: PropTypes.object,
  isHeaderPanelClosed: PropTypes.bool
};

export default Lobby;
