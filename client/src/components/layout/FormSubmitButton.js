import React from "react";
import PropTypes from "prop-types";
import Color from "../constants/Colors";

const FormSubmitButton = (props) => {
  return (
    <div id={props.id}>
      <button
        type='submit'
        className={`col s12 btn-small waves-effect waves-dark`}
        style={{ ...props.style, ...buttonStyle }}
        {...props}
      >
        <i className='material-icons' style={{ verticalAlign: "middle" }}>
          {props.icons}
        </i>
        &nbsp;&nbsp;{props.text}
      </button>
    </div>
  );
};

const buttonStyle = {
  color: Color.lightColor,
  background: Color.primaryColor,
  width: "100%",
};

FormSubmitButton.propTypes = {
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
};

FormSubmitButton.defaultProps = {
  text: "",
};

export default FormSubmitButton;
