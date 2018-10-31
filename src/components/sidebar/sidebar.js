import React from "react";
import PropTypes from "prop-types";
import Chatroom from "../chatroom.js";

/*
 * Sidebar, a sidebar panel contain chatroom message
 * @param currentUser, who is login
 * @param table, current table data, include all game data, players and viewers
 * @param isSidebarPanelShown, a boolean value to decide should show/hide sidebar
 * @param setRef, set ref for sidebar component, in order to get sidebar width
 * @param toggleSidebar, a function to toggle chatroom
 * @param screenWidth, current screen width value
 * @param chatroom, chatroom object, includes chat message and chatroom info
 */

Sidebar.propTypes = {
  currentUser: PropTypes.object,
  table: PropTypes.object,
  isSidebarPanelShown: PropTypes.bool,
  setRef: PropTypes.object,
  toggleSidebar: PropTypes.func,
  screenWidth: PropTypes.number,
  chatroom: PropTypes.object
};

const Sidebar = ({
  currentUser,
  table,
  isSidebarPanelShown,
  setRef,
  toggleSidebar,
  screenWidth,
  chatroom
}) => {
  if (!table || !isSidebarPanelShown) {
    return null;
  }

  return (
    <div ref={setRef} className="sidebar">
      <div className="tabs">
        <div className={"current chatroom"}>
          <span />
          <b>chatroom</b>
        </div>
        <span onClick={toggleSidebar} className="close-btn" />
      </div>
      <div className="tab-wrapper" />
      <div>
        <Chatroom
          screenHeight={screenWidth}
          screenWidth={screenWidth}
          currentUser={currentUser}
          chatroom={chatroom}
          table={table}
        />
      </div>
    </div>
  );
};

export default Sidebar;
