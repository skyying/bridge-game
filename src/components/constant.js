import React from "react";
import {Heart, Spade, Diamond, Club} from "./shape/shape.js";
export const CARD_NUM = {
  TOTAL: 52,
  SUITS: 4
};
export const TOTAL_TRICKS = 13;

export const TOTAL_CARDS_OF_EACH_TRICK = 4;

export const TIMER = {
  join: 15000
};
export const ROBOT_NAME = "-robot";

export const RESULT = {
  win: "YOU WIN",
  lose: "YOU LOSE"
};

export const PLAYER_NUM = 4;
export const EMPTY_SEAT = -1;
export const NO_TRUMP = 4;
export const BID_NUM = [1, 2, 3, 4, 5, 6, 7];

export const SUIT_SHAPE = {
  0: (scale, fill) => <Club scale={scale} fill={fill} />,
  1: (scale, fill) => <Diamond scale={scale} fill={fill} />,
  2: (scale, fill) => <Heart scale={scale} fill={fill} />,
  3: (scale, fill) => <Spade scale={scale} fill={fill} />,
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
  order: -1
};

export const PLAYERS = [EMPTY_SEAT, EMPTY_SEAT, EMPTY_SEAT, EMPTY_SEAT];
export const GAME_STATE = {
  join: "join",
  auction: "auction",
  playing: "playing",
  gameover: "gameover",
  close: "close"
};

export const TAB_OPTION = ["Chat", "Result"];

export const DIRECTION = ["south", "west", "north", "east"];

export const Emoji = [
  "🤔",
  "🤣",
  "🤩",
  "😝",
  "😍",
  "😵",
  "🙄",
  "🤭",
  "😱",
  "🤷",
  "👍",
  "👎",
  "👯",
  "👀",
  "🐷",
  "🎉",
  "🎃",
  "🍺",
  "🔥",
  "🛁"
];
