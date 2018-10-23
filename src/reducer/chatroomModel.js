import {DB} from "../firebase/db.js";
import {dispatch} from "../reducer/reducer.js";
export default class ChatroomModel {
  constructor(linkId, id) {
    this.linkId = linkId;
    this.id = id;
    this.get();
  }
  get() {
    DB.getChatRoomById(this.id).then(chatroom => {
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
    DB.getNodeByPath(`chatroom/${this.id}/`, snapshot =>
      this.update(snapshot.val())
    );
  }
}
