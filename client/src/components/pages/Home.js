import React, { Fragment, useEffect } from "react";
import MainNav from "../layout/MainNav";
import { Link } from "react-router-dom";

import { loadUser } from "../../actions/authActions";
import {
  getMembers,
  clearMembers,
  clearCurrent,
} from "../../actions/memberActions";

import { Tooltip, IconButton } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import MembersTable from "./MembersTable";

import Color from "./../constants/Colors";

import M from "materialize-css/dist/js/materialize.min.js";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Home = (props) => {
  const { isAuthenticated, error, members } = props;

  useEffect(() => {
    props.loadUser();
    if (isAuthenticated) {
      props.getMembers();
    } else {
      props.clearMembers();
    }

    if (error) {
      M.toast({ html: `${error}` });
    }
    // eslint-disable-next-line
  }, [isAuthenticated, error]);

  return (
    <Fragment>
      <MainNav selItem={"home-id"} />
      <div className='main'>
        <div className='row'>
          <div className='col s12 xl10 offset-xl1'>
            <MembersTable tbData={members} />
          </div>
        </div>
        <div
          className='row'
          style={{ position: "absolute", bottom: "10px", right: "20px" }}
        >
          <StyledTooltip title='Add Member' placement='left' arrow>
            <Link to={"/member-administrator"}>
              <IconButton
                aria-label='filters'
                onClick={() => props.clearCurrent()}
                style={{ backgroundColor: Color.primaryHex }}
              >
                <i className={`material-icons`}>add</i>
              </IconButton>
            </Link>
          </StyledTooltip>
        </div>
      </div>
    </Fragment>
  );
};

const StyledTooltip = withStyles({
  tooltip: {
    fontSize: "1rem",
  },
})(Tooltip);

Home.propTypes = {
  loadUser: PropTypes.func.isRequired,
  getMembers: PropTypes.func.isRequired,
  clearCurrent: PropTypes.func.isRequired,
  clearMembers: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
  members: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.auth.error,
  members: state.member.members,
});

const mapDispatchToProps = (dispatch) => {
  return {
    loadUser: () => dispatch(loadUser()),
    getMembers: () => dispatch(getMembers()),
    clearCurrent: () => dispatch(clearCurrent()),
    clearMembers: () => dispatch(clearMembers()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
