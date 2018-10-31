import React from "react";
import PropTypes from "prop-types";
import loadingImg from "../../images/loading.svg";
import "../../style/loading.scss";

const Loading = () => {
  return (
    <div className="main-loading">
      <div className="loading-anim">
        <img src={loadingImg} />
      </div>
    </div>
  );
};

export default Loading;
