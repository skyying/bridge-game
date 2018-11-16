import Database from "../firebase";
import {dispatch} from "../reducer";

/*
 * A chatroom class to handle the communcation with database 
 * @param linkId, string, a unique path name for a table, is generate from a timeStamp
 * @param id, string, a unique key of a table, is generate by firebase when push a new node
 */
export default class ChatroomModel {
  constructor(linkId, id) {
    this.linkId = linkId;
    this.id = id;
    this.get();
  }
  // get data
  get() {
    Database.getChatRoomById(this.id).then(chatroom => {
      this.update(chatroom, this.id);
      this.listenChanged();
    });
  }

  // update data
  update(chatroom, id) {
    dispatch("UPDATE_CHAT_ROOM", {
      chatroom: chatroom,
      id: id
    });
  }

  // register data change event
  listenChanged() {
    Database.getNodeByPath(`chatroom/${this.id}/`, snapshot =>
      this.update(snapshot.val(), this.id)
    );
  }
}
