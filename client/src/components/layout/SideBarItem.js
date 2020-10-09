import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const SideBarItem = (props) => {
  return (
    <li id={props.id} {...props}>
      <Link to={props.link} onClick={props.onClick}>
        <i className={`material-icons left`}>{props.icon}</i>
        {props.text}
      </Link>
    </li>
  );
};

SideBarItem.propTypes = {
  id: PropTypes.string,
  link: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.string,
  text: PropTypes.string.isRequired,
};

SideBarItem.defaultProps = {
  link: "/",
  text: "Side Nav Item",
};

export default SideBarItem;
