import React, { Fragment, useEffect, useState } from "react";
import MainNav from "../layout/MainNav";
import SubHeader from "../layout/SubHeader";
import FormLayout from "../layout/FormLayout";
import InputContainer from "../layout/InputContainer";
import SelectContainer from "../layout/SelectContainer";
import FormSubmitButton from "../layout/FormSubmitButton";
import ButtonContainer from "../layout/ButtonContainer";
import Color from "../constants/Colors";

import { loadUser } from "../../actions/authActions";
import {
  addMember,
  updateMember,
  clearErrors,
} from "../../actions/memberActions";

import M from "materialize-css/dist/js/materialize.min.js";
import PropTypes from "prop-types";
import { connect } from "react-redux";

//#region Outer Functions

const showElem = (elemName) => {
  document.getElementById(elemName).style.display = "block";
};

const hideElem = (elemName) => {
  document.getElementById(elemName).style.display = "none";
};

const enableElem = (elemName) => {
  document.getElementById(elemName).disabled = false;
};

const disableElem = (elemName) => {
  document.getElementById(elemName).disabled = true;
};

//#endregion

const MembersAdministrator = (props) => {
  const memberTypeDropdown = [
    {
      text: "HOD",
      value: "HOD",
    },
    {
      text: "Teacher",
      value: "Teacher",
    },
    {
      text: "Student",
      value: "Student",
    },
  ];

  const accStatusDropdown = [
    {
      text: "Approved",
      value: "Approved",
    },
    {
      text: "Blocked",
      value: "Blocked",
    },
  ];

  const initialInputs = {
    _id: "",
    name: "",
    email: "",
    password: "",
    member_type: "",
    acc_status: "",
    create_date: "",
  };

  const [member, setMember] = useState(initialInputs);

  const {
    _id,
    name,
    email,
    password,
    member_type,
    acc_status,
    create_date,
  } = member;

  const onChange = (e) =>
    setMember({ ...member, [e.target.name]: e.target.value });

  const { current, error, returnmessage } = props;

  useEffect(() => {
    props.loadUser();

    if (error) {
      M.toast({ html: `${error}` });
      props.clearErrors();
    }

    if (returnmessage === "Member added successfully...!") {
      M.toast({ html: `${returnmessage}` });
      props.clearErrors();
      setMember(initialInputs);
    } else if (returnmessage === "Member updated successfully...!") {
      M.toast({ html: `${returnmessage}` });
      props.clearErrors();
      props.history.push("/");
    }

    if (current) {
      setMember(current);
      disableElem("password");
    } else {
      hideElem("passwordBtn");
    }

    // eslint-disable-next-line
  }, [current, error, returnmessage]);

  const onSubmit = (e) => {
    e.preventDefault();

    if (!current) {
      if (
        _id === "" ||
        name === "" ||
        email === "" ||
        password === "" ||
        member_type === "" ||
        acc_status === ""
      ) {
        M.toast({ html: "Please enter all fields!" });
      } else {
        props.addMember(member);
      }
    } else if (current) {
      if (
        name === "" ||
        email === "" ||
        member_type === "" ||
        acc_status === ""
      ) {
        M.toast({ html: "Please enter all fields!" });
      } else {
        const obj = {
          _id,
          name,
          email,
          member_type,
          acc_status,
        };
        props.updateMember(obj);
      }
    }
  };

  return (
    <Fragment>
      <MainNav selItem={"home-id"} />
      <div className='main'>
        <div className='row'>
          <SubHeader
            text={`Members Administrator - [${
              current ? "Update Member" : "Add New Member"
            }]`}
            style={{ textAlign: "left", paddingLeft: "20px" }}
          />
          <div className='row'>
            <div className='col s10 offset-s1 m8 offset-m2'>
              <FormLayout>
                <div className='row'>
                  <form onSubmit={onSubmit}>
                    <div className='col s12 m6'>
                      <InputContainer
                        id='_id'
                        type='text'
                        name='_id'
                        value={_id}
                        text='Member ID'
                        onChange={onChange}
                        labelClass={`${_id !== "" ? "active" : ""}`}
                        required
                      />
                    </div>
                    <div className='col s12 m6'>
                      <InputContainer
                        id='name'
                        type='text'
                        name='name'
                        value={name}
                        text='Member Name'
                        onChange={onChange}
                        labelClass={`${name !== "" ? "active" : ""}`}
                        required
                      />
                    </div>
                    <div className='col s12 m6'>
                      <InputContainer
                        id='email'
                        type='email'
                        name='email'
                        value={email}
                        text='Email Address'
                        onChange={onChange}
                        labelClass={`${email !== "" ? "active" : ""}`}
                        required
                      />
                    </div>
                    <div className='col s12'>
                      <InputContainer
                        id='password'
                        type='password'
                        name='password'
                        value={password}
                        text='Password'
                        onChange={onChange}
                        labelClass={`${password !== "" ? "active" : ""}`}
                        required
                      />
                    </div>
                    <div className='col s12 m6'>
                      <SelectContainer
                        id='member_type'
                        name='member_type'
                        list={memberTypeDropdown}
                        value={member_type}
                        text='Select member type'
                        onChange={onChange}
                        required
                      />
                    </div>
                    <div className='col s12 m6'>
                      <SelectContainer
                        id='acc_status'
                        name='acc_status'
                        list={accStatusDropdown}
                        value={acc_status}
                        text='Select account status'
                        onChange={onChange}
                        required
                      />
                    </div>
                    <div className='row'>
                      <div className='col s12 m4'>
                        <FormSubmitButton
                          text={`${current ? "Update Member" : "Add Member"}`}
                        />
                      </div>
                      <div className='col s12 m4'>
                        <ButtonContainer
                          id='passwordBtn'
                          text={"Change Password"}
                          color={Color.dangerHex}
                        />
                      </div>
                      <div className='col s12 m4'>
                        <ButtonContainer
                          text={"Cancel"}
                          link={"/"}
                          style={{
                            color: Color.dangerHex,
                            backgroundColor: "transparent",
                            width: "100%",
                          }}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </FormLayout>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

MembersAdministrator.propTypes = {
  current: PropTypes.object.isRequired,
  returnmessage: PropTypes.string.isRequired,
  loadUser: PropTypes.func.isRequired,
  addMember: PropTypes.func.isRequired,
  updateMember: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  current: state.member.current,
  error: state.member.error,
  returnmessage: state.member.returnmessage,
});

const mapDispatchToProps = (dispatch) => {
  return {
    loadUser: () => dispatch(loadUser()),
    addMember: (obj) => dispatch(addMember(obj)),
    updateMember: (obj) => dispatch(updateMember(obj)),
    clearErrors: () => dispatch(clearErrors()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MembersAdministrator);
