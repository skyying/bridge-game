import React from 'react';
// @ts-ignore
import {Heart, Spade, Diamond, Club} from "../../Shape/index.tsx";

function NT() {
    return <div>NT</div>
}


export interface IShape {
    scale: number
}

export interface IShapeMap {
    [index: number]: React.FunctionComponent<IShape>

}

const SUIT_SHAPE: IShapeMap = {
    0: Club,
    1: Diamond,
    2: Heart,
    3: Spade,
    4: NT
};

export default SUIT_SHAPE;
