import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Color from "../constants/Colors";

const ButtonContainer = (props) => {
  return (
    <Link to={props.link}>
      <a
        id={props.id}
        className={`waves-effect waves-light btn`}
        style={{ ...buttonStyle, backgroundColor: props.color, ...props.style }}
        onClick={props.onClick}
        {...props}
      >
        <i className='material-icons left'>{props.icons}</i>
        {props.text}
      </a>
    </Link>
  );
};

const buttonStyle = {
  color: Color.fore,
  width: "100%",
};

ButtonContainer.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
  onClick: PropTypes.func,
  icons: PropTypes.string,
  link: PropTypes.string,
};

ButtonContainer.defaultProps = {
  text: "Default Button",
};

export default ButtonContainer;
