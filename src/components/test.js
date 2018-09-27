import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      parent: "parent"
    };
    this.handleParent = this.handleParent.bind(this);
  }
  handleParent() {
    this.setState({parent: "changed parent in parent comp"});
  }
  render() {
    return (
      <div>
        <Test2 evt={this.handleParent} parent={this.state.parent} />
      </div>
    );
  }
}

class Test2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      parent: this.props.parent
    };
  }
  render() {
    return <div onClick={this.props.evt}> in child comp: display this.state.parent 
      {this.state.parent}
      {this.props.parent}
    </div>;
  }
}
