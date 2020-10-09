import React from "react";
import PropTypes from "prop-types";
import Color from "../constants/Colors";

const SubHeader = (props) => {
  return (
    <h5 {...props} style={{ ...headingStyle, ...props.style }}>
      <img
        src={props.src}
        alt={props.alt}
        style={{ height: "40px", verticalAlign: "middle" }}
      />
      &nbsp;{props.text}
    </h5>
  );
};

const headingStyle = {
  color: Color.primaryColor,
  fontSize: "2em",
  textAlign: "center",
};

SubHeader.propTypes = {
  style: PropTypes.object,
  text: PropTypes.string.isRequired,
};

SubHeader.defaultProps = {
  text: "Default Text",
};

export default SubHeader;
