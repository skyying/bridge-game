import React from "react";
import PropTypes from "prop-types";
import Chatroom from "../chatroom";

/*
 * Sidebar, a sidebar panel contain chatroom message
 * @param currentUser, object, who is login
 * @param table, object, current table data, include all game data, players and viewers
 * @param isSidebarPanelShown, boolean, a boolean value to decide should show/hide sidebar
 * @param setRef, object, set ref for sidebar component, in order to get sidebar width
 * @param toggleSidebar, function,  a function to toggle chatroom
 * @param screenWidth, number, current screen width value
 * @param chatroom, object, includes chat message and chatroom info
 */

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
        <span onClick={() => toggleSidebar()} className="close-btn" />
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

Sidebar.propTypes = {
  currentUser: PropTypes.object,
  table: PropTypes.object,
  isSidebarPanelShown: PropTypes.bool,
  setRef: PropTypes.object,
  toggleSidebar: PropTypes.func,
  screenWidth: PropTypes.number,
  chatroom: PropTypes.object
};

export default Sidebar;
