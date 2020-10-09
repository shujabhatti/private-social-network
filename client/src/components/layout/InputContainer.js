import React from "react";
import PropTypes from "prop-types";
import Color from "../constants/Colors";

const InputContainer = (props) => {
  return (
    <div className='input-field'>
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
  borderRadius: "3px",
  height: "25px",
  paddingLeft: "8px",
  paddingBottom: "10px",
  borderBottom: "0px",
};

const labelStyle = {
  paddingLeft: "10px",
  fontSize: "14px",
};

InputContainer.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  style: PropTypes.object,
  labelClass: PropTypes.string,
};

InputContainer.defaultProps = {
  type: "text",
  name: "",
  value: "",
  text: "",
};

export default InputContainer;
