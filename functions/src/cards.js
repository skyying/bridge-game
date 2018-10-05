exports.cards = function(table) {
    console.log("in cards, should print something here xxxxxxx");
    let {players, game} = table;
    let {cards} = game;
    console.log("cards", cards);
    let remainingCards = [0, 0, 0, 0]
        .map((userIndex, index) => {
            return cards.filter((card, i) => i % 4 === index);
        })
        .filter(card => card.trick === 0);
    // .slice(0);
    console.log("remainingCards", remainingCards);
    return remainingCards;
};
