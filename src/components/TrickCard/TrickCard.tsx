import React from 'react';
// @ts-ignore
import Card from "../card/card.tsx";

type ITrickCard = {
    value: number
}

export default function TrickCard({value}: ITrickCard): JSX.Element {
    return (<div>
        <Card flipUp={true} value={value} />
    </div>)
}
