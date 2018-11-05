import Database from "../firebase";
import {dispatch} from "../reducer";
import ChatroomModel from "../reducer/chatroomModel.js";

/*
 * A table class to handle the communcation with database 
 * @param linkId, string, a unique path name for a table, is generate from a timeStamp
 */
export default class TableModel {
  constructor(linkId) {
    this.linkId = linkId;
    this.get();
  }
  //get data, and udpate to state
  get() {
    return Database.getTableByLinkId(this.linkId).then(table => {
      this.chatroom = new ChatroomModel(this.linkId, table.id);
      this.update(table);
      this.listenTableChange(table);
      return table;
    });
  }
  // update table data
  update(table) {
    dispatch("UPDATE_TABLE_DATA", {
      table: table
    });
  }
  // register table change event
  listenTableChange(table) {
    Database.getNodeByPath(`tables/${table.id}/`, snapshot =>
      this.update(snapshot.val())
    );
  }
}
