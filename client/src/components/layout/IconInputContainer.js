import React from "react";
import PropTypes from "prop-types";
import Color from "../constants/Colors";

const IconInputContainer = (props) => {
  return (
    <div className='input-field'>
      <i className='material-icons prefix'>{props.icon}</i>
      <input
        type={props.type}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        maxLength='40'
        {...props}
        style={{ ...inputStyle, ...props.style }}
      />
      <label
        htmlFor={props.name}
        style={labelStyle}
        className={props.value ? "active" : ""}
      >
        {props.text}
      </label>
    </div>
  );
};

const inputStyle = {
  backgroundColor: Color.inputColor,
  height: "25px",
  paddingLeft: "8px",
  paddingBottom: "8px",
};

const labelStyle = {
  paddingLeft: "10px",
  fontSize: "14px",
};

IconInputContainer.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  style: PropTypes.object,
  labelClass: PropTypes.string,
};

IconInputContainer.defaultProps = {
  type: "text",
  name: "",
  value: "",
  text: "",
};

export default IconInputContainer;
