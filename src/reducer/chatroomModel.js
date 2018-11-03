import Database from "../firebase";
import {dispatch} from "../reducer";
export default class ChatroomModel {
  constructor(linkId, id) {
    this.linkId = linkId;
    this.id = id;
    this.get();
  }
  get() {
    Database.getChatRoomById(this.id).then(chatroom => {
      this.update(chatroom);
      this.listenChanged();
    });
  }
  update(chatroom) {
    dispatch("UPDATE_CHAT_ROOM", {
      chatroom: chatroom
    });
  }
  listenChanged() {
    Database.getNodeByPath(`chatroom/${this.id}/`, snapshot =>
      this.update(snapshot.val())
    );
  }
}
