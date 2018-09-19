import React from "react";
import PropTypes from "prop-types";

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isStart: false,
      cards: []
    };
  }
  render() {
    console.log("COMP: Game");
    console.log(this.props);
    let table = this.props.table;
    let cards = table.cards;
    let players = table.players;
    let domPlayers = [];

    if (players) {
      for (let key in players) {
        domPlayers.push(<div key={players[key]}> {players[key]} </div>);
      }
    }

    let cardList = [];
    for (let card in cards) {
      cardList.push([card, cards[card]]);
    }

    let list = cardList.map((card, index) => {
      let [cardNo, cardInfo] = card;
      return (
        <div key={index}>
          <div>{cardNo}</div>
          <div>{cardInfo.player}</div>
        </div>
      );
    });
    return (
      <div>
        <div>{domPlayers}</div>
        <div>{list}</div>
      </div>
    );
  }
}
