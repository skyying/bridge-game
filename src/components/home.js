import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import tableList from "./table_list.js";
export default class Lobby extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <tableList />
        <tableList />
      </div>
    );
  }
}
