import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "../style/thumbnail.scss";
// import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import avatar0 from "../images/avatar/0.svg";
import avatar1 from "../images/avatar/1.svg";
import avatar2 from "../images/avatar/2.svg";
import avatar3 from "../images/avatar/3.svg";
import avatar4 from "../images/avatar/4.svg";
import avatar5 from "../images/avatar/5.svg";
import avatar6 from "../images/avatar/6.svg";
import avatar7 from "../images/avatar/7.svg";
import avatar8 from "../images/avatar/8.svg";
import avatar9 from "../images/avatar/9.svg";
import avatar10 from "../images/avatar/10.svg";
import avatar11 from "../images/avatar/11.svg";
import avatar12 from "../images/avatar/12.svg";
import avatar13 from "../images/avatar/13.svg";
import avatar14 from "../images/avatar/14.svg";
import avatar15 from "../images/avatar/15.svg";
import avatar16 from "../images/avatar/16.svg";
import avatar17 from "../images/avatar/17.svg";
import avatar18 from "../images/avatar/18.svg";
import avatar19 from "../images/avatar/19.svg";
import avatar20 from "../images/avatar/20.svg";
import avatar21 from "../images/avatar/21.svg";
import avatarSlot from "../images/avatar/avatar_slot.svg";

const Avatar = {
  0: avatar0,
  1: avatar1,
  2: avatar2,
  3: avatar3,
  4: avatar4,
  5: avatar5,
  6: avatar6,
  7: avatar7,
  8: avatar8,
  9: avatar9,
  10: avatar10,
  11: avatar11,
  12: avatar12,
  13: avatar13,
  14: avatar14,
  15: avatar15,
  16: avatar16,
  17: avatar17,
  18: avatar18,
  19: avatar19,
  20: avatar20
};

const avatarNum = Object.keys(Avatar).length;
export const Thumbnail = ({name = "", size = 40, disabled = false}) => {
  let shiftAvatar = avatarNum;
  if (name.length) {
    shiftAvatar =
            name
              .split("")
              .map(str => str.charCodeAt(str) || +str)
              .reduce((sum, num) => sum + num, 0) % avatarNum;
  }
  return (
    <div
      className="thumbnail disabled"
      style={{
        width: size,
        height: size,
        borderRadius: size
      }}>
      <img
        className={disabled ? "disabled" : ""}
        width={size - 16}
        src={Avatar[shiftAvatar]}
      />
    </div>
  );
};

export const ThumbailGroup = ({players, size, teamOrder}) => {
  let team = players.filter((player, index) => index % 2 === teamOrder);
  let members = team.map((player, index) => (
    <Thumbnail key={`member-${index}`} name={player} size={size} />
  ));
  return <div className="thumbnail-group">{members}</div>;
};

export class WaitingThumbnail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posY: 0,
      position: 0,
      stop: false,
      isGoingUp: true,
      name: "enter"
    };
    this.changeImg = this.changeImg.bind(this);
    this.timer = setInterval(this.changeImg, 20);
  }
  changeImg() {
    let {posY} = this.state;
    if (this.state.posY > 60) {
      this.setState({isGoingUp: false});
    } else if (this.state.posY < -60) {
      this.setState({isGoingUp: true});
    }
    let dy;
    if (this.state.isGoingUp) {
      dy = Math.floor(Math.random() * 2);
    } else if (this.state.isGoingUp === false) {
      dy = Math.floor(Math.random() * -3);
    }
    this.setState({posY: posY + dy});
  }
  componentDidUpdate(prevProps) {
    if (this.props.stop !== prevProps.stop && this.props.stop === true) {
      this.setState({stop: true, posY: 40});
      clearInterval(this.timer);
    }
  }
  render() {
    let size = this.props.size || 30;
    let disabled = this.props.disabled || false;
    let pos = this.state.position;
    let name = disabled ? `disabled ${this.state.name}` : this.state.name;
    let img = (
      <img
        className={name}
        style={{
          transform: `translateY(${this.state.posY}%) scale(1.07)`
        }}
        width={size - 16}
        src={avatarSlot}
      />
    );
    return (
      <div
        className="waiting-thumbnail disabled"
        style={{
          width: size,
          height: size,
          borderRadius: size
        }}>
        {img}
      </div>
    );
  }
}
