// get porker card detail information offset by current login user
export const mapFlipDownCards = dislayList => {
  if (!dislayList) return;
  let flat = dislayList.flat();
  let cardsNumberOnHand = 5;
  let totalLen = flat.length;
  // if cards number is under n, split flipdown card into two row;
  if (totalLen <= cardsNumberOnHand) {
    let mid = Math.floor(totalLen / 2);
    return [flat.slice(0, mid), flat.slice(mid, totalLen)];
  } else {
    let threeRow = [[], [], []];
    flat.map((card, index) => threeRow[index % 3].push(card));
    return threeRow;
  }
};
