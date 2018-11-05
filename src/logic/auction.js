const MAX_TRICK_NUM = 7;
const MAX_SUIT_NUM = 5;

// depends on current game state, to calcuate all avalialbe auction options for
// current turn user
export const getAuctionOpt = game => {
  // default trump is -1;
  const DEFAULT_TRUMP = -1;
  const value = game.bid.trick * MAX_SUIT_NUM + game.bid.trump;
  const LAST_OPT = MAX_TRICK_NUM * MAX_SUIT_NUM + DEFAULT_TRUMP;
  let isEmptyBid = value < 0;
  let isLastOpt = value === LAST_OPT;
  let isRunOutOfTrumpOpt = value % MAX_SUIT_NUM === 4 && value !== 0;
  if (isEmptyBid) {
    return {
      trickOpt: getFilteredOpt(MAX_TRICK_NUM, opt => true),
      trumpOpt: getFilteredOpt(MAX_SUIT_NUM, opt => true),
      value: value,
      isLastOpt: isLastOpt
    };
  } else if (isLastOpt) {
    return {
      trickOpt: [],
      trumpOpt: [],
      value: value,
      isLastOpt: isLastOpt
    };
  } else if (isRunOutOfTrumpOpt) {
    return {
      trickOpt: getFilteredOpt(
        MAX_TRICK_NUM,
        opt => opt > game.bid.trick
      ),
      trumpOpt: getFilteredOpt(MAX_SUIT_NUM, opt => true),
      value: value,
      isLastOpt: isLastOpt
    };
  } else {
    return {
      trickOpt: getFilteredOpt(
        MAX_TRICK_NUM,
        opt => opt >= game.bid.trick
      ),
      trumpOpt: getFilteredOpt(MAX_SUIT_NUM, opt => opt > game.bid.trump),
      value: value,
      isLastOpt: isLastOpt
    };
  }
};

const getOpt = len => {
  return Array.from({length: len})
    .fill(0)
    .map((opt, index) => index);
};
const getFilteredOpt = (len, condition) => {
  return getOpt(len).filter(opt => condition(opt));
};
