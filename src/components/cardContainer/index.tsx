import React, {useCallback} from "react";
import {ICard} from "../card/card";

function getWrapperName(name: string): string {
    return name ? `card-wrapper ${name}` : "card-wrapper";
}

export default function CardContainer ({name, flipUp, evt, value, children}: ICard): JSX.Element {
    const clickEvt = useCallback(() => {
        if (evt) {
            evt(value);
        }}, [evt, value])
    return (
        <div onClick={clickEvt} className={getWrapperName(name)}>
            <div className={flipUp ? "card flip-up" : "card flip-down"}>
                <div className="card-inner">{flipUp ? children : null}</div>
            </div>
        </div>
    );
};
