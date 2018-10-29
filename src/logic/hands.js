import {PLAYER_NUM, TOTAL_TRICKS, GAME_STATE} from "../components/constant.js";
import {mapFlipDownCards} from "../components/examineCards.js";
import TrickLogic from "./trick.js";

export default class Hands {
  constructor(table, currentUser) {
    this.table = table;
    this.trickModel = new TrickLogic();
    this.firstCard = this.trickModel.getFirstCardOfCurrentTrick(
      this.table.game
    );
    this.declarerIndex = table.game.bid.declarer;
    this.players = table.players;
    this.cards = table.game.cards;
    this.currentUser = currentUser;
    this.isCurrentUserAPlayer = this.isCurrentUserAPlayer();
    this.dummyMode = true;
    this.currentTurnPlayer = this.players[this.table.game.deal];
    this.dummyIndex = (this.table.game.bid.declarer + 2) % PLAYER_NUM;
    this.currentUserIndex = 0;
    this.offsetIndex = this.getOffsetIndex();
    this.offsetCards = this.offsetData().cards;
    this.offsetPlayers = this.offsetData().players;
    this.offsetDummyIndex = this.getIndexInOffsetPlayers(
      this.players[this.dummyIndex]
    );
    this.offsetCurrentUserIndex = this.getIndexInOffsetPlayers(
      this.players[this.currentUser.uid]
    );
    this.all = this.getHands();
  }

  getIndexInOffsetPlayers(player) {
    let index = this.offsetPlayers.findIndex(seat => seat === player);
    return index < 0 ? 0 : index;
  }

  getDisplayHand() {
    // flip cards up or down base on current user, player, and is dummy hand
    return this.getUnplayedCards().map((hand, playerHandIndex) => {
      let flipDownCards = [[], [], [], []];
      hand.map(card => {
        flipDownCards[Math.floor(card.value / TOTAL_TRICKS)].push(card);
      });

      flipDownCards.filter(item => item.length !== 0);

      if (
        playerHandIndex !== this.currentUserIndex &&
                playerHandIndex !== this.offsetDummyIndex &&
                this.isCurrentUserAPlayer
      ) {
        let mapResult = mapFlipDownCards(flipDownCards);
        if (mapResult) {
          flipDownCards = mapResult;
        }
      }
      return flipDownCards;
    });
  }
  getUnplayedCards() {
    return this.offsetCards.map((hand, index) => {
      if (index === 1 && this.offsetDummyIndex !== 1) {
        hand = hand.sort((a, b) => b.value - a.value);
      } else {
        hand = hand.sort((a, b) => a.value - b.value);
      }
      return hand.filter(card => card.trick === 0);
    });
  }
  getFilteredHand() {
    const hands = this.getDisplayHand();
    return hands.map(hand => hand.filter(suit => suit.length > 0));
  }
  getHands() {
    const hands = this.getFilteredHand();
    return hands.map((hand, playerHandIndex) => {
      const hasFollowSameSuit = this.hasSameSuitWithFirstCard(
        hand.flat()
      );

      const playerHand = this.offsetPlayers[playerHandIndex];

      return hand.map((each, index) => {
        let dummyPlayer = this.players[this.dummyIndex];
        let declarerPlayer = this.players[this.declarerIndex];

        // if player is nither declarer nor dummy plaer
        let canBeClick =
                    this.table.gameState === GAME_STATE.playing &&
                    this.isCurrentUserAPlayer &&
                    // current player is equal to south;
                    this.currentTurnPlayer === playerHand &&
                    playerHandIndex === 0;

        // current turn is dummay hand, and current login user is declare,
        // let current user can control dummy hand's card
        if (
          this.dummyMode &&
                    this.isCurrentUserAPlayer &&
                    dummyPlayer === this.currentTurnPlayer
        ) {
          if (
            this.currentUser.uid === declarerPlayer &&
                        playerHandIndex === 2
          ) {
            canBeClick = true;
          }
          if (
            this.currentUser.uid === dummyPlayer &&
                        playerHandIndex === 0
          ) {
            canBeClick = false;
          }
        }

        let flipUp =
                    (this.table.gameState === GAME_STATE.playing ||
                        playerHandIndex === this.currentUserIndex) &&
                    (!this.isCurrentUserAPlayer ||
                        playerHandIndex === this.currentUserIndex ||
                        playerHandIndex === this.offsetDummyIndex);

        let allowClickEvt = card => {
          return (
            this.firstCard === null ||
                        !hasFollowSameSuit ||
                        Math.floor(card.value / TOTAL_TRICKS) ===
                            Math.floor(this.firstCard.value / TOTAL_TRICKS)
          );
        };

        return each.map((cardItem, i) => {
          return Object.assign({}, cardItem, {
            pos: [index, i],
            flipUp: flipUp,
            canBeClick: canBeClick && allowClickEvt(cardItem)
          });
        });
      });
    });
  }
  getOffsetIndex() {
    return this.players.findIndex(user => user === this.currentUser.uid);
  }
  isCurrentUserAPlayer() {
    return this.players.includes(this.currentUser.uid);
  }
  hasSameSuitWithFirstCard(cards) {
    return (
      this.firstCard &&
            cards.filter(card => {
              return (
                Math.floor(card.value / TOTAL_TRICKS) ===
                    Math.floor(this.firstCard.value / TOTAL_TRICKS)
              );
            }).length > 0
    );
  }
  offsetData() {
    let cardsByPlayer = this.players
      .map((userIndex, index) => {
        return this.cards.filter(
          (card, i) => i % this.players.length === index
        );
      })
      .slice(0);
    if (this.isCurrentUserAPlayer) {
      return {
        cards: [
          ...cardsByPlayer.slice(this.offsetIndex),
          ...cardsByPlayer.slice(0, this.offsetIndex)
        ],
        players: [
          ...this.players.slice(this.offsetIndex),
          ...this.players.slice(0, this.offsetIndex)
        ]
      };
    }
    return {
      cards: cardsByPlayer,
      players: this.players.slice(0)
    };
  }
}