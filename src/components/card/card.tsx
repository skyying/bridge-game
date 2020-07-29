import React from "react";
// import PropTypes from "prop-types";
// import SUIT_SHAPE from "../constant/SuitShape/index";
// import {TOTAL_TRICKS} from "../constant/constant.js";
// import {CARD_RANK} from "../constant/index";
import "../../style/reset.scss";
import "../../style/card.scss";
import CardContainer from "../cardContainer/index";

const TOTAL_TRICKS: number = 13;
const CARD_RANK: (number | string)[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];


export interface ICard {
    value: number,
    flipUp: boolean,
    evt?: (value) => void,
    name?: any,
    children?: JSX.Element[]
}


function styleAsRedOrBlack(value: number) {
    const kind: number = Math.floor(value / TOTAL_TRICKS);
    return kind === 1 || kind === 2 ? "red value" : "black value"
}

/*
 * value: 0 - 51, poker card face-value
 * evt: a click event
 * flipUp: should flip a card up or down
 * name: class name for style
 */
export default function Card (props: ICard):JSX.Element {

    const {value, flipUp, evt, name} = props

    return (
        <CardContainer value={value} evt={evt} flipUp={flipUp} name={name}>
            <div
                className={styleAsRedOrBlack(value)}>
                {CARD_RANK[value % TOTAL_TRICKS]}
                {/*{SUIT_SHAPE[kind](0.235)}*/}
            </div>
            {/*<LargeShape kind={kind} />*/}
        </CardContainer>
    );
};

/*
 * kind: 0-3, which suit, 0: club, 1: diamond, 2: heart, 3: spade
 */
// const LargeShape = ({kind}) => {
//     return <div className="large-shape">{SUIT_SHAPE[kind](0.5)}</div>;
// };
//
// LargeShape.propTypes = {
//     kind: PropTypes.number
// };
