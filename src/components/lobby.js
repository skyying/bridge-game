import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {
  IndexRoute,
  BrowserRouter,
  Router,
  Route,
  Switch,
  Link
} from "react-router-dom";
import TableList from "./tableList.js";

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log("COMP: LOBBY");
    console.log(this.props.tables);
    return (
      <div>
            this is lobby table list
        <TableList tables={this.props.tables} />
      </div>
    );
  }
}
