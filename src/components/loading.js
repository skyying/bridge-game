import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

export default class Loading extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="main-loading">
        <h2>Loading ...</h2>
      </div>
    );
  }
}
