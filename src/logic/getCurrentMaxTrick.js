
export const getCurrentMaxTrick = cards => {
  if (!cards) return null;
  return Math.max(...cards.map(card => card.trick));
};
