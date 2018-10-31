import {RESULT, PLAYER_NUM} from "../components/constant/index.js";
export default class TeamScore {
  constructor(table, currentUser) {
    const BASE_TRICK = 6;
    this.bid = table.game.bid;
    this.declarer = this.bid.declarer;
    this.players = table.players;
    this.playerIndex = this.getPlayerIndex(currentUser.uid);
    this.targetTrick = this.bid.trick + 1 + BASE_TRICK;
    this.isCurrentUserAPlayer = this.playerIndex >= 0;
    this.scoreboard = this.getScore(table.game);
    this.result = this.getResult(table.game);
  }
  getResult(game) {
    let isPlayerInDeclarerTeam = this.playerIndex % 2 === this.declarer % 2;
    let isUserWin = false,
      resultWords;
    if (
      (isPlayerInDeclarerTeam &&
                this.getScore(game).teamOne >= this.targetTrick) ||
            (!isPlayerInDeclarerTeam &&
                this.getScore(game).teamOne > 13 - this.targetTrick)
    ) {
      resultWords = RESULT.win;
      isUserWin = true;
    } else if (this.isCurrentUserAPlayer) {
      resultWords = RESULT.lose;
    } else {
      resultWords = "";
    }
    return {
      isUserWin: isUserWin,
      resultWords: resultWords
    };
  }
  getPlayerIndex(user) {
    let index = this.players.indexOf(user);
    return index >= 0 ? index : 0;
  }
  getScoreByCondition(game, condition) {
    let teamOne = 0,
      teamTwo = 0;
    game.cards.map((card, index) => {
      let count = card.isWin ? 1 : 0;
      if (condition(card, index)) {
        teamOne += count;
      } else {
        teamTwo += count;
      }
    });
    return {
      teamOne: teamOne,
      teamTwo: teamTwo
    };
  }
  getDefaultScore(game) {
    let condition = (card, index) => {
      const MEMBER_COUNT = 2;
      return (index % PLAYER_NUM) % MEMBER_COUNT === 0;
    };
    return this.getScoreByCondition(game, condition);
  }
  getScore(game) {
    let condition = (card, index) => {
      const MEMBER_COUNT = 2;
      return (
        card.player % MEMBER_COUNT === this.playerIndex % MEMBER_COUNT
      );
    };
    return this.getScoreByCondition(game, condition);
  }
}
