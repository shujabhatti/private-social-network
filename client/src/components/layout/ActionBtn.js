import React from "react";
import Color from "../constants/Colors";
import { Link } from "react-router-dom";

const ActionBtn = (props) => {
  return (
    <div {...props}>
      <Link to={props.link ? props.link : null}>
        <a
          href='#!'
          className={`btn-floating btn-${props.size} darken-2`}
          onClick={props.onClick}
        >
          <i
            className={`${props.size} material-icons`}
            style={{ backgroundColor: `${props.color}`, ...props.style }}
          >
            {props.icon}
          </i>
        </a>
      </Link>
    </div>
  );
};

ActionBtn.defaultProps = {
  color: Color.primaryColor,
};

export default ActionBtn;
