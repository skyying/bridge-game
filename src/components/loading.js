import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import loadingImg from "../images/loading.svg";

import "../style/loading.scss";

export const Loading = () => {
  return (
    <div className="main-loading">
      <div className="loading-anim">
        <img src={loadingImg} />
      </div>
    </div>
  );
};
