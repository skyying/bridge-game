import Database from "../firebase";
import {dispatch, dispatchToDatabase} from "../reducer";
import ChatroomModel from "../reducer/chatroomModel.js";
export default class TableModel {
  constructor(linkId) {
    this.linkId = linkId;
    this.get();
  }
  get() {
    return Database.getTableByLinkId(this.linkId).then(table => {
      this.chatroom = new ChatroomModel(this.linkId, table.id);
      this.update(table);
      this.listenTableChange(table);
      return table;
    });
  }
  update(table) {
    dispatch("UPDATE_TABLE_DATA", {
      table: table
    });
  }
  listenTableChange(table) {
    Database.getNodeByPath(`tables/${table.id}/`, snapshot =>
      this.update(snapshot.val())
    );
  }
}
