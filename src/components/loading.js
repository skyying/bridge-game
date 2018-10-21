import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import loadingImg from "../images/loading.svg";

import "../style/loading.scss";

export default class Loading extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="main-loading">
        <div className="loading-anim">
          <img src={loadingImg} />
        </div>
      </div>
    );
  }
}
