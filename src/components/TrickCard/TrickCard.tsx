import React from 'react';
// import {Card} from "../card";

type ITrickCard = {
    value: number
}




export default function TrickCard({value}: ITrickCard): JSX.Element {
    return (<div>
        {value}
        {/*<Card flipUp={true} value={value} />*/}
    </div>)
}
