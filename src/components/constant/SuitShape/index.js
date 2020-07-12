import React from 'react';
import {Heart, Spade, Diamond, Club} from "../../shape";

const SUIT_SHAPE = {
    0: (scale, fill) => <Club scale={scale} fill={fill} />,
    1: (scale, fill) => <Diamond scale={scale} fill={fill} />,
    2: (scale, fill) => <Heart scale={scale} fill={fill} />,
    3: (scale, fill) => <Spade scale={scale} fill={fill} />,
    4: scale => <div>NT</div>
};

export default SUIT_SHAPE;
