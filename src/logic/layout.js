/*
 * a class to calcuate how to display cards of four hands.
 * if a hand is south or north player, their cards should display align center 
 * no matter how many cards are left. if a hand is west or east, their cards should 
 * always align most left or most right
 * @params hands, array, a hands result generate from hands class
 * @params posInfo, object, a default config of how many pixel will be offset from each card and other 
 * position information
 * return object
 */
export default class Layout {
  constructor(hands, posInfo) {
    this.hands = hands;
    this.posInfo = posInfo;
    this.style = this.getStyle();
  }
  getStyle() {
    return this.getValidSuitCount().map((countOfHand, index) => {
      if (index % 2 === 0) {
        return {left: this.getHorizonPos(index)};
      }
      return {
        top: this.getVerticalPos(index),
        width: this.getMaxWidth(index)
      };
    });
  }
  getMaxWidth(index) {
    let minWidth = 150;
    let {horizonOffset, cardWidth} = this.posInfo;
    let targetWidth =
            (this.getMaximumCardsNumOfSuit()[index] - 1) * horizonOffset +
            cardWidth;

    if (targetWidth < 0 || targetWidth < minWidth) {
      return minWidth;
    }
    return targetWidth;
  }
  getMaximumCardsNumOfSuit() {
    return this.hands.all
      .map(hand => {
        return hand.filter(suit => suit.length > 0);
      })
      .map(hand => Math.max(...hand.map(each => each.length)));
  }
  getVerticalPos(index) {
    let {verticalOffset, playerHeight, cardHeight, height} = this.posInfo;
    let totalSuitsInHand = this.getValidSuitCount()[index];
    return (
      (height -
                ((totalSuitsInHand - 1) * verticalOffset +
                    cardHeight -
                    playerHeight)) /
            2
    );
  }
  getHorizonPos(index) {
    let {horizonOffset, width} = this.posInfo;
    let totalCardsInHand = this.getSize()[index];
    return (width - (horizonOffset * totalCardsInHand + horizonOffset)) / 2;
  }
  getValidSuitCount() {
    return this.hands.all
      .map(hand => {
        return hand.filter(suit => suit.length > 0);
      })
      .map(hand => hand.length);
  }
  getSize() {
    return this.hands.getUnplayedCards().map(hand => {
      return hand.length;
    });
  }
}
