import React from "react";
import PropTypes from "prop-types";

import Trick from "./trick.js";
import PlayingInfo from "./PlayingInfo.js";

export default class PlayingState extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let {table, hands, cardsByPlayer, isTrickFinish} = this.props;
    return (
      <div>
        <PlayingInfo {...this.props} />
        <div className="arena">
          <div className="hands">{hands}</div>
          <Trick
            cards={table.game.cards}
            cardsByPlayer={cardsByPlayer}
            order={table.game.order}
            isTrickFinish={isTrickFinish}
          />
        </div>
      </div>
    );
  }
}
