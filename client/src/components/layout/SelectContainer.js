import React from "react";
import PropTypes from "prop-types";
import Color from "../constants/Colors";

const SelectContainer = (props) => {
  return (
    <div className='input-field'>
      <select
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        {...props}
        className='browser-default'
        style={{ ...selectStyle, ...props.style }}
      >
        <option value='' defaultValue>
          {props.text}
        </option>

        {props.list ? (
          props.list.map((obj) => (
            <option key={obj.value} value={obj.value}>
              {obj.text}
            </option>
          ))
        ) : (
          <option value=''>No Record Found...</option>
        )}
      </select>
    </div>
  );
};

const selectStyle = {
  backgroundColor: Color.input,
  borderTopLeftRadius: "5px",
  borderTopRightRadius: "5px",
  height: "35px",
  paddingLeft: "8px",
  paddingBottom: "8px",
};

SelectContainer.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  style: PropTypes.object,
};

SelectContainer.defaultProps = {
  name: "default name",
  value: "default value",
  text: "default text",
  list: [],
};

export default SelectContainer;
