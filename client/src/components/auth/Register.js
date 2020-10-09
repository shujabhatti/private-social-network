import React, { useState, Fragment, useEffect } from "react";
import MainNav from "../layout/MainNav";
import FormLayout from "../layout/FormLayout";
import SubHeader from "../layout/SubHeader";
import InputContainer from "../layout/InputContainer";
import FormSubmitButton from "../layout/FormSubmitButton";

import { register, clearErrors } from "../../actions/authActions";

import BgParticles from "../layout/BgParticles";
import M from "materialize-css/dist/js/materialize.min.js";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Register = (props) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const { error, isAuthenticated } = props;

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/");
    }

    if (error === "User already exists..!") {
      M.toast({ html: `${error}` });
      props.clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (name === "" || email === "" || password === "") {
      M.toast({ html: "Please enter all fields!" });
    } else if (password !== password2) {
      M.toast({ html: "Password Mismatch!" });
    } else {
      props.register({ name, email, password });
    }
  };

  return (
    <Fragment>
      <BgParticles />
      <MainNav selItem={"reg-id"} title={"Admin [Register New]"} />
      <div className='main'>
        <div className='row'>
          <div className='col s10 offset-s1 m6 offset-m3 l5 offset-l4 offset-xl4 xl4'>
            <FormLayout>
              <SubHeader
                text={"Register User"}
                src={require("../images/register.png")}
              />
              <div className='row' style={{ margin: "20px" }}>
                <form onSubmit={onSubmit}>
                  <InputContainer
                    type='text'
                    name='name'
                    value={name}
                    text='Username'
                    onChange={onChange}
                    required
                  />
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
                    minLength='6'
                    required
                  />
                  <InputContainer
                    type='password'
                    name='password2'
                    value={password2}
                    text='Confirm Password'
                    onChange={onChange}
                    minLength='6'
                    required
                  />
                  <FormSubmitButton text={"Register"} />
                </form>
              </div>
            </FormLayout>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Register.propTypes = {
  error: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  error: state.auth.error,
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = (dispatch) => {
  return {
    register: (obj) => dispatch(register(obj)),
    clearErrors: () => dispatch(clearErrors()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
