import React, { useState, Fragment, useEffect } from "react";
import MainNav from "../layout/MainNav";
import FormLayout from "../layout/FormLayout";
import SubHeader from "../layout/SubHeader";
import InputContainer from "../layout/InputContainer";
import FormSubmitButton from "../layout/FormSubmitButton";

import {
  login,
  clearErrors,
  clearChangePassword,
} from "../../actions/authActions";

import M from "materialize-css/dist/js/materialize.min.js";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Login = (props) => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { email, password } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const { error, isAuthenticated, chgpwdmsg } = props;

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/");
    }

    if (chgpwdmsg) {
      M.toast({ html: `${chgpwdmsg.msg}` });
      props.clearChangePassword();
    }

    if (error === "Invalid Email..!") {
      M.toast({ html: `${error}` });
      props.clearErrors();
    } else if (error === "Invalid Password..!") {
      M.toast({ html: `${error}` });
      props.clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, chgpwdmsg, props.history]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      M.toast({ html: "Please enter all fields!" });
    } else {
      props.login({ email, password });
    }
  };

  return (
    <Fragment>
      <MainNav selItem={"login-id"} />
      <div className='main'>
        <div className='row'>
          <div className='col s10 offset-s1 m6 offset-m3 l5 offset-l4 offset-xl4 xl4'>
            <FormLayout>
              <SubHeader text={"Login User"} icons={"account_circle"} />
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
                    text='Password'
                    onChange={onChange}
                    required
                  />
                  <FormSubmitButton text={"Login"} />
                </form>
              </div>
            </FormLayout>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Login.propTypes = {
  error: PropTypes.object.isRequired,
  chgpwdmsg: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  clearChangePassword: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  error: state.auth.error,
  isAuthenticated: state.auth.isAuthenticated,
  chgpwdmsg: state.auth.chgpwdmsg,
});

const mapDispatchToProps = (dispatch) => {
  return {
    login: (obj) => dispatch(login(obj)),
    clearErrors: () => dispatch(clearErrors()),
    clearChangePassword: () => dispatch(clearChangePassword()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
