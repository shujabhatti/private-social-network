import React, { Fragment, useEffect } from "react";
import MainNav from "../layout/MainNav";
import SubHeader from "../layout/SubHeader";
import ActionBtn from "../layout/ActionBtn";

import { loadUser } from "../../actions/authActions";
import {
  getMembers,
  clearMembers,
  clearCurrent,
} from "../../actions/memberActions";

import MembersTable from "./MembersTable";

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
          <SubHeader
            text={"Members Records"}
            style={{ textAlign: "left", paddingLeft: "20px" }}
          />
          <div className='row'>
            <div className='col s10 offset-s1'>
              <MembersTable tbData={members} />
            </div>
          </div>
        </div>
        <ActionBtn
          link={"/member-administrator"}
          icon={"add"}
          onClick={() => props.clearCurrent()}
          className={"fixed-action-btn tooltipped"}
          data-position='left'
          data-tooltip='Add Member'
          size={"large"}
        />
      </div>
    </Fragment>
  );
};

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
