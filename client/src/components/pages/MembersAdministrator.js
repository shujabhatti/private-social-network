import React, { Fragment, useEffect, useState } from "react";
import MainNav from "../layout/MainNav";
import SubHeader from "../layout/SubHeader";
import FormLayout from "../layout/FormLayout";
import InputContainer from "../layout/InputContainer";
import LabelContainer from "../layout/LabelContainer";
import SelectContainer from "../layout/SelectContainer";
import FormSubmitButton from "../layout/FormSubmitButton";
import ButtonContainer from "../layout/ButtonContainer";
import ConfirmationDialogue from "../layout/ConfirmationDialogue";
import Color from "../constants/Colors";

import { loadUser } from "../../actions/authActions";
import {
  addMember,
  updateMember,
  changePassword,
  clearCurrent,
  clearErrors,
} from "../../actions/memberActions";

import { hideElem, enableElem, disableElem } from "../../helperFunctions";

import Moment from "react-moment";
import M from "materialize-css/dist/js/materialize.min.js";
import PropTypes from "prop-types";
import { connect } from "react-redux";

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
    program: "",
    course: "",
    year: "",
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
    program,
    course,
    year,
    acc_status,
    create_date,
  } = member;

  const onChange = (e) =>
    setMember({ ...member, [e.target.name]: e.target.value });

  const { current, error, returnmessage } = props;

  const [confirmDialog, setConfirmDialog] = useState(false);

  useEffect(() => {
    props.loadUser();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
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
      disableElem("_id");
      disableElem("password");
    } else {
      hideElem("create_date");
      hideElem("passwordBtn");
    }

    // eslint-disable-next-line
  }, [current, error, returnmessage]);

  const onConfirmDialogClose = () => {
    setConfirmDialog(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setConfirmDialog(true);
  };

  const onConfirm = () => {
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
    } else if (
      current &&
      document.getElementById("password").disabled === true
    ) {
      if (
        _id === "" ||
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
          program,
          course,
          year,
          acc_status,
        };
        props.updateMember(obj);
      }
    } else if (
      current &&
      document.getElementById("password").disabled === false
    ) {
      if (_id === "") {
        M.toast({ html: "Member ID not found!" });
      } else if (password === "") {
        M.toast({ html: "Please enter valid password!" });
      } else {
        const obj = {
          _id,
          password,
        };
        props.changePassword(obj);
      }
    }
    onConfirmDialogClose();
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
                      />
                    </div>
                    <div className='col s12 m6'>
                      <LabelContainer
                        id='create_date'
                        name='create_date'
                        value={
                          <Moment format='MMMM do YYYY, h:mm:ss a'>
                            {new Date(create_date)}
                          </Moment>
                        }
                        text='Create Date'
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
                      />
                    </div>
                    {/* Student Data Section */}
                    <div className='col s12 m4'>
                      <InputContainer
                        type='text'
                        name='program'
                        value={program}
                        text='Program'
                        onChange={onChange}
                        labelClass={`${program !== "" ? "active" : ""}`}
                      />
                    </div>
                    <div className='col s12 m4'>
                      <InputContainer
                        type='text'
                        name='course'
                        value={course}
                        text='Course'
                        onChange={onChange}
                        labelClass={`${course !== "" ? "active" : ""}`}
                      />
                    </div>
                    <div className='col s12 m4'>
                      <InputContainer
                        type='number'
                        name='year'
                        value={year}
                        text='Year'
                        onChange={onChange}
                        labelClass={`${year !== "" ? "active" : ""}`}
                      />
                    </div>
                    {/* Student Data Section */}
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
                          onClick={() => {
                            enableElem("password");
                            disableElem("name");
                            disableElem("email");
                            disableElem("member_type");
                            disableElem("acc_status");
                            hideElem("passwordBtn");
                          }}
                          color={Color.dangerHex}
                        />
                      </div>
                      <div className='col s12 m4'>
                        <ButtonContainer
                          text={"Cancel"}
                          link={"/"}
                          onClick={() => props.clearCurrent()}
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
      <ConfirmationDialogue
        open={confirmDialog}
        onConfirmDialogClose={onConfirmDialogClose}
        title='Update Member'
        content='Are you sure you want to save changes?'
        onConfirm={onConfirm}
      />
    </Fragment>
  );
};

MembersAdministrator.propTypes = {
  current: PropTypes.object.isRequired,
  returnmessage: PropTypes.string.isRequired,
  loadUser: PropTypes.func.isRequired,
  addMember: PropTypes.func.isRequired,
  updateMember: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired,
  clearCurrent: PropTypes.func.isRequired,
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
    changePassword: (obj) => dispatch(changePassword(obj)),
    clearCurrent: () => dispatch(clearCurrent()),
    clearErrors: () => dispatch(clearErrors()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MembersAdministrator);
