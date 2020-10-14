import React, { useState, Fragment, useEffect } from "react";
import MainNav from "../layout/MainNav";
import FormLayout from "../layout/FormLayout";
import SubHeader from "../layout/SubHeader";
import InputContainer from "../layout/InputContainer";
import FormSubmitButton from "../layout/FormSubmitButton";

import {
  loadUser,
  changePassword,
  clearErrors,
} from "../../actions/authActions";

import BgParticles from "../layout/BgParticles";

import M from "materialize-css/dist/js/materialize.min.js";
import {Link} from 'react-router-dom';
import PropTypes from "prop-types";
import { connect } from "react-redux";

const ChangePassword = (props) => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    newpassword: "",
  });

  const { email, password, newpassword } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const { error } = props;

  useEffect(() => {
    props.loadUser();

    if (error === "User not found..!") {
      M.toast({ html: `${error}` });
      props.clearErrors();
    } else if (error === "Invalid email..!") {
      M.toast({ html: `${error}` });
      props.clearErrors();
    } else if (error === "Invalid Password..!") {
      M.toast({ html: `${error}` });
      props.clearErrors();
    }
    // eslint-disable-next-line
  }, [error]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (email === "" || password === "" || newpassword === "") {
      M.toast({ html: "Please enter all fields!" });
    } else {
      props.changePassword({ email, password, newpassword });
    }
  };

  return (
    <Fragment>
      <BgParticles />
      <MainNav title={"Admin [Change Password]"} />
      <div className='main'>
        <div className='row'>
          <div className='col s10 offset-s1 m6 offset-m3 l4 offset-l4'>
            <FormLayout>
              <Link to={"/"} style={{float: 'right'}}>
                <i className='material-icons'>
                  close
                </i>
              </Link>
              <br/>
              <SubHeader
                text={"Change Password"}
                src={require("../images/changepassword.png")}
              />
              <div className='row' style={{ margin: "20px" }}>
                <form onSubmit={onSubmit}>
                  <InputContainer
                    type='email'
                    name='email'
                    value={email}
                    text='Email address'
                    onChange={onChange}
                    required
                  />
                  <InputContainer
                    type='password'
                    name='password'
                    value={password}
                    text='Old Password'
                    onChange={onChange}
                    minLength='6'
                    required
                  />
                  <InputContainer
                    type='password'
                    name='newpassword'
                    value={newpassword}
                    text='New Password'
                    onChange={onChange}
                    minLength='6'
                    required
                  />
                  <FormSubmitButton text={"Change Password"} />
                </form>
              </div>
            </FormLayout>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

ChangePassword.propTypes = {
  error: PropTypes.object.isRequired,
  changePassword: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  loadUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  error: state.auth.error,
});

const mapDispatchToProps = (dispatch) => {
  return {
    loadUser: () => dispatch(loadUser()),
    changePassword: (obj) => dispatch(changePassword(obj)),
    clearErrors: () => dispatch(clearErrors()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
