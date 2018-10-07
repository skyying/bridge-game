import React from "react";
import {Heart, Spade, Diamond, Club} from "./shape/shape.js";
export const CARD_NUM = {
  TOTAL: 52,
  SUITS: 4,
  HAND: 13
};

export const PLAYER_NUM = 4;
export const EMPTY_SEAT = -1;
export const NO_TRUMP = 4;
export const BID_NUM = [1, 2, 3, 4, 5, 6, 7];

export const SUIT_SHAPE = {
  0: scale => <Club scale={scale} />,
  1: scale => <Diamond scale={scale} />,
  2: scale => <Heart scale={scale} />,
  3: scale => <Spade scale={scale} />,
  4: scale => <div>NT</div>
};

export const CARD_RANK = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];

export const DEFAULT_GAME = {
  deal: 0,
  bid: {
    isDb: false,
    isRdb: false,
    trick: 0,
    trump: -1
  },
  order: -1,
  isGameOver: false
};

export const PLAYERS = [EMPTY_SEAT, EMPTY_SEAT, EMPTY_SEAT, EMPTY_SEAT];
export const GAME_STATE = {
  join: "join",
  auction: "auction",
  playing: "playing",
  gameover: "gameover"
};

export const TAB_OPTION = ["Chat", "Result"];
