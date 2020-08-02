import React from "react";
import PropTypes from "prop-types";
import SUIT_SHAPE from "../constant/SuitShape/index.tsx";
import {TOTAL_TRICKS} from "../constant/constant.ts";
import {CARD_RANK} from "../constant";
import "../../style/reset.scss";
import "../../style/card.scss";
import CardContainer from "../cardContainer/index.tsx";
import Card from './card.tsx';
// @ts-ignore
import TrickCard from "../TrickCard/TrickCard.tsx";
export default {Card, TrickCard};


