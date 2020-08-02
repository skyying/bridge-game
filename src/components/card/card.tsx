import React from "react";
// @ts-ignore
import SUIT_SHAPE, {IShape} from "../constant/SuitShape/index.tsx";
import "../../style/reset.scss";
import "../../style/card.scss";
// @ts-ignore
import CardContainer from "../cardContainer/index.tsx";

const TOTAL_TRICKS: number = 13;
const CARD_RANK: (number | string)[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];


export interface ICard {
    value: number,
    flipUp: boolean,
    evt?: (value) => void,
    name?: any,
    children?: JSX.Element[]
}

const Heart: number = 1;
const Diamond: number = 2;

function getShapeOrder(value: number): number {
    return Math.floor(value / TOTAL_TRICKS);
}

function styleAsRedOrBlack(value: number) {
    const order = getShapeOrder(value);
    return order === Heart || order === Diamond ? "red value" : "black value"
}

/*
 * value: 0 - 51, poker card face-value
 * evt: a click event
 * flipUp: should flip a card up or down
 * name: class name for style
 */
export default function Card (props: ICard):JSX.Element {

    const {value, flipUp, evt, name} = props
    const order: number = getShapeOrder(value)
    const ShapeComponent: React.FunctionComponent<IShape> = SUIT_SHAPE[order]

    return (
        <CardContainer value={value} evt={evt} flipUp={flipUp} name={name}>
            <div
                className={styleAsRedOrBlack(value)}>
                {CARD_RANK[value % TOTAL_TRICKS]}
                <ShapeComponent scale={0.235} />
            </div>
            <LargeShape order={order} />
        </CardContainer>
    );
};

/*
 * kind: 0-3, which suit, 0: club, 1: diamond, 2: heart, 3: spade
 */
function LargeShape ({order}: {order: number}): JSX.Element {
    const ShapeComponent: React.FunctionComponent<IShape> = SUIT_SHAPE[order]
    return <div className="large-shape">
        <ShapeComponent scale={0.5}/>
    </div>;
};

