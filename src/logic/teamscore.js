import {RESULT} from "../components/constant.js";
export default class TeamScore {
  constructor(table, currentUser) {
    const BASE_TRICK = 6;
    this.bid = table.game.bid;
    this.declarer = this.bid.declarer;
    this.players = table.players;
    this.playerIndex = this.getPlayerIndex(currentUser.uid);
    // trick start from 0, 0 means one trick...
    this.targetTrick = this.bid.trick + 1 + BASE_TRICK;
    this.isCurrentUserAPlayer = this.playerIndex >= 0;
    this.scoreboard = this.getScore(table.game);
    this.result = this.getResult();
  }
  getResult() {
    let isPlayerInDeclarerTeam = this.playerIndex % 2 === this.declarer % 2;
    let isUserWin = false,
      resultWords;
    if (
      isPlayerInDeclarerTeam &&
            this.scoreboard.currentPlayer >= this.targetTrick
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
  getScore(game) {
    const MEMBER_COUNT = 2;
    let currentPlayerScore = 0,
      opponentScore = 0;
    game.cards.map(card => {
      let count = card.isWin ? 1 : 0;
      if (
        card.player %
                MEMBER_COUNT ===
                this.playerIndex % MEMBER_COUNT
      ) {
        currentPlayerScore += count;
      } else {
        opponentScore += count;
      }
    });
    return {
      currentPlayer: currentPlayerScore,
      opponent: opponentScore
    };
  }
}
