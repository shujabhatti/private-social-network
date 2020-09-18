import React from "react";
import PropTypes from "prop-types";
import Color from "../constants/Colors";

const SubHeader = (props) => {
  return (
    <h5 {...props} style={{ ...headingStyle, ...props.style }}>
      <i
        className='material-icons medium hide-on-small-only'
        style={{ verticalAlign: "middle" }}
      >
        {props.icons}
      </i>
      &nbsp;&nbsp; {props.text}
    </h5>
  );
};

const headingStyle = {
  color: Color.dark,
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
