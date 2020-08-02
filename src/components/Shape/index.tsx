import React from "react";
import PropTypes from "prop-types";

import type {IShape} from "../constant/SuitShape";

const colorForHeartAndDiamond = "#FF525D";
const colorForSpadeAndClub = "#222222";
const defaultProps = {
    scale: PropTypes.number,
    fill: PropTypes.string
};

/*
 * four svg shape, spade, heart, diamond, club
 * @param, scale, how large is this shape, scale 1 is 100 width, default is 1;
 * @param, fill, color for shape
 */
export function Heart ({scale}: IShape): JSX.Element {
    const DEFAULT_RATIO = 0.89;
    return (
        <SvgContainer scale={scale} ratio={DEFAULT_RATIO} fill={colorForHeartAndDiamond}>
            <path d="M70.9643211,0 C59.2565148,0 53.056072,5.64335169 49.9709368,10.1546618 C46.889795,5.64335169 40.6986702,0 29.0152682,0 C15.0405332,0 0,9.29808951 0,29.7129874 C0,37.7588224 1.74734105,44.1438566 5.84192287,51.0638602 C9.82779506,57.7993304 18.2685439,66.1002296 30.9298889,75.7372219 C35.8715185,79.4984213 40.4235682,82.6625486 43.3724836,84.6547112 C49.0391399,88.4833363 49.2609963,88.5228158 49.9456452,88.5232594 C49.9802548,88.5241466 50.0135332,88.5245902 50.0468117,88.5245902 C50.6941887,88.5245902 51.1401201,88.3183208 56.5574098,84.6764471 C59.5081,82.6922691 64.0641431,79.5401188 69.0102098,75.7873476 C81.6870849,66.1698733 90.1513504,57.851674 94.1682825,51.0643038 C98.2557649,44.1571643 100,37.7712429 100,29.713431 C100,9.29808951 84.9488177,0 70.9643211,0 Z" />
        </SvgContainer>
    );
};

export function Spade({scale}: IShape): JSX.Element  {
    return (
        <SvgContainer scale={scale} ratio={1} fill={colorForSpadeAndClub}>
            <path
                d="M88.5085925,35.4545714 C84.7618726,29.0791639 76.8279859,21.2225289 64.9275728,12.1017285 C60.2811897,8.54098888 56.0030971,5.54662558 53.2315338,3.66150342 C47.8489868,0 47.6921609,0 47.0310732,0 C46.3716539,0 46.2152451,0 40.8347835,3.64219036 C38.0615518,5.52017509 33.7788713,8.50362231 29.1295686,12.0555451 C17.2145573,21.1574523 9.25814768,29.0300415 5.48264861,35.4541516 C1.63958096,41.9928804 0,48.0361874 0,55.6623252 C0,74.9846174 14.1481113,83.785073 27.2935382,83.785073 C33.059808,83.785073 37.4025496,82.3177007 40.6500126,80.3074635 L37.0551136,94 L56.8014075,94 L53.1693874,80.1668141 C56.4343682,82.2488454 60.8367536,83.785073 66.7252308,83.785073 C79.8614817,83.785073 94,74.9846174 94,55.6623252 C94,48.0475233 92.3579165,42.0042164 88.5085925,35.4545714 Z"
                fill={colorForSpadeAndClub}
            />
        </SvgContainer>
    );
};

export function Diamond ({scale}: IShape) : JSX.Element {
    let w = 93,
        h = 100;
    return (
        <SvgContainer scale={scale} ratio={1} fill={colorForHeartAndDiamond}>
            <polygon
                points={`${w / 2} 0 0 ${h / 2} ${w / 2} ${h} ${w} ${h / 2}`}
            />
        </SvgContainer>
    );
};

export function Club ({scale}: IShape) :JSX.Element {
    const DEFAULT_RATIO = 0.98;
    return (
        <SvgContainer scale={scale} ratio={DEFAULT_RATIO} fill={colorForSpadeAndClub}>
            <path
                d="M70.3555185,31.9345189 C71.174537,29.4903991 71.587963,26.9404062 71.587963,24.3163882 C71.587963,10.9083748 60.5577593,0 47,0 C33.4422407,0 22.412037,10.9083748 22.412037,24.3163882 C22.412037,26.9404062 22.825463,29.4903991 23.6444815,31.9345189 C10.5223426,32.426872 0,43.137703 0,56.2332616 C0,69.641275 11.0302037,80.5496498 24.587963,80.5496498 C30.872037,80.5496498 36.6116944,78.2040867 40.9631111,74.3539201 L35.6686481,92.1010101 L58.1820833,92.1010101 L52.8323519,74.1692877 C57.2077037,78.12834 63.0287407,80.5496498 69.412037,80.5496498 C82.9697963,80.5496498 94,69.641275 94,56.2332616 C94,43.137703 83.4776574,32.426872 70.3555185,31.9345189 Z"
                fill={colorForSpadeAndClub}
            />
        </SvgContainer>
    );
};

interface ISize {
    w: number,
    h: number
}

function getSVGSize(scale: number, ratio: number): ISize {
    let w = scale * 100,
        h = Math.floor(w * ratio);
    return {w, h};
}

/*
 * Svg container, will wrap svg as children and decide their viewbox
 * @param, children, four svg shape
 * @param, ratio, used to calcuate container height
 * @param, scale, from 0 to n, e.g. scale 1 = 100 width
 * @param, fill, shape color
 */
const SvgContainer = ({children, ratio, scale, fill}) => {
    let {w, h}: ISize = getSVGSize(scale, ratio);
    return (
        <div>
            <svg width={`${w}px`} height={`${h}px`} viewBox={`0 0 ${w} ${h}`}>
                <g fill={fill} transform={`scale(${scale})`}>
                    {children}
                </g>
            </svg>
        </div>
    );
};

