import React from "react";
import Color from "../constants/Colors";
import PropTypes from "prop-types";

const TextAreaContainer = (props) => {
  return (
    <div className='input-field'>
      <textarea
        id='textarea1'
        className='materialize-textarea'
        name={props.name}
        onChange={props.onChange}
        {...props}
        style={{ ...textAreaStyle, ...props.style }}
        data-length='240'
      >
        {props.value}
      </textarea>
      <label
        htmlFor='textarea1'
        style={labelStyle}
        className={props.value ? "active" : ""}
      >
        {props.text}
      </label>
    </div>
  );
};

const textAreaStyle = {
  backgroundColor: Color.inputColor,
  borderRadius: "3px",
  paddingLeft: "8px",
  paddingRight: "8px",
  paddingBottom: "8px",
  marginBottom: "0px",
};

const labelStyle = {
  paddingLeft: "10px",
  fontSize: "14px",
};

TextAreaContainer.propTypes = {
  text: PropTypes.string.isRequired,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  style: PropTypes.object,
};

TextAreaContainer.defaultProps = {
  text: "Default text",
};

export default TextAreaContainer;
