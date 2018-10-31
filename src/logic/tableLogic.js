import {EMPTY_SEAT, PLAYER_NUM} from "../components/constant";

export default class TableLogic {
  constructor(tableList) {
    this.list = tableList;
    this.open = this.getOpenList(tableList);
    this.playing = this.getPlayingList(tableList);
    this.overDue = 60000;
    this.ROOM_NUM_LEN = 3;
  }
  getRoomId(key) {
    const ROOM_NUM_LEN = 3;
    key = "" + key;
    return key.slice(key.length - ROOM_NUM_LEN, key.length);
  }
  getPlayingList(list = this.list) {
    if (!list) {
      return null;
    }
    return this.filterPlayingListKey(list).map(linkId => {
      return {
        linkId: linkId,
        roomId: this.getRoomId(linkId),
        players: this.getPlayerName(
          list[linkId].playerInfo,
          list[linkId].players
        )
      };
    });
  }
  getOpenList(list = this.list) {
    if (!list) {
      return null;
    }
    return this.filterOpenListKey(list).map(linkId => ({
      linkId: linkId,
      roomId: this.getRoomId(linkId),
      players: list[linkId].players,
      playerInfo: list[linkId].playerInfo,
      availableSeats: this.getEmptySeat(list[linkId].players),
      owner: this.getOwner(list, linkId)
    }));
  }
  getPlayerName(playerInfo, players) {
    return players.map(
      player =>
        (playerInfo[player] && playerInfo[player].displayName) ||
                "Anonymous"
    );
  }
  getOwner(list, linkId) {
    const OWNER_INDEX = 0;
    const {playerInfo, players} = list[linkId];
    return playerInfo[players[OWNER_INDEX]].displayName;
  }
  getEmptySeat(players) {
    if (!players) {
      return PLAYER_NUM - 1;
    }
    return players.filter(seat => seat === EMPTY_SEAT).length;
  }
  filterPlayingListKey(list = this.list) {
    let linkIdList = Object.keys(list);
    return linkIdList.filter(id => {
      return list[id].players.every(seat => seat !== EMPTY_SEAT);
    });
  }
  filterOpenListKey(list = this.list) {
    const OVERDUE = 60000;
    let linkIdList = Object.keys(list);
    let filteredList = linkIdList.filter(id => {
      let createTime = Number(id);
      if (
        list[id].players &&
                new Date().getTime() - createTime <= OVERDUE
      ) {
        return list[id].players.some(seat => seat === EMPTY_SEAT);
      }
      return false;
    });
    return filteredList;
  }
}
