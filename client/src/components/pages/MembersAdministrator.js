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
import ActionBtn from "../layout/ActionBtn";
import Color from "../constants/Colors";

import { loadUser } from "../../actions/authActions";
import {
  addMember,
  updateMember,
  changePassword,
  clearCurrent,
  clearErrors,
} from "../../actions/memberActions";

import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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
    memberImage: "",
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
    memberImage,
    create_date,
  } = member;

  const onChange = (e) =>
    setMember({ ...member, [e.target.name]: e.target.value });

  const { current, error, returnmessage } = props;

  const [confirmDialog, setConfirmDialog] = useState(false);
  const [showImage, setShowImage] = useState("");

  //#region Functions

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
      setShowImage("");
    } else if (returnmessage === "Member updated successfully...!") {
      M.toast({ html: `${returnmessage}` });
      props.clearErrors();
      props.history.push("/");
    } else if (returnmessage === "Image Updated!") {
      M.toast({ html: `${returnmessage}` });
      props.clearErrors();
    }

    if (current) {
      setMember(current);
      disableElem("_id");
      disableElem("password");
      if (current.memberImage) {
        setShowImage(current.memberImage);
      }
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
        setConfirmDialog(true);
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
        setConfirmDialog(true);
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
        setConfirmDialog(true);
      }
    }
  };

  const onConfirm = () => {
    if (!current) {
      props.addMember(member);
    } else if (
      current &&
      document.getElementById("password").disabled === true
    ) {
      const obj = {
        _id,
        name,
        email,
        member_type,
        program,
        course,
        year,
        acc_status,
        memberImage,
      };
      props.updateMember(obj);
    } else if (
      current &&
      document.getElementById("password").disabled === false
    ) {
      const obj = {
        _id,
        password,
      };
      props.changePassword(obj);
    }
    onConfirmDialogClose();
  };

  const loadFile = (e) => {
    if (e.target.files[0]) {
      const createPath = URL.createObjectURL(e.target.files[0]);
      if (createPath) {
        setMember({ ...member, memberImage: e.target.files[0] });
        setShowImage(createPath);
      } else {
        setShowImage("");
      }
    }
  };

  //#endregion

  const classes = useStyles();

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
            <div className='col xs12 s10 offset-s1 m10 offset-m1 l10 offset-l1 xl8 offset-xl2'>
              <FormLayout>
                <div className='row'>
                  <form onSubmit={onSubmit}>
                    <div className='row'>
                      <div className='col s12 offset-m1 m3 offset-l1 l4 offset-xl1 xl3'>
                        {/* Image Section */}
                        <div style={{ marginLeft: "10px" }}>
                          <Avatar
                            alt={name && name.charAt(0).toUpperCase()}
                            src={showImage}
                            className={classes.large}
                          />
                        </div>
                        <div>
                          <div
                            className='input-field'
                            id='change-image-container'
                            style={{ marginLeft: "10px" }}
                          >
                            <input
                              id='file'
                              name='image'
                              type='file'
                              accept='image/jpeg, image/png'
                              style={{ display: "none" }}
                              onChange={loadFile}
                            />
                            <label
                              htmlFor='file'
                              style={{
                                cursor: "pointer",
                                display: "contents",
                              }}
                            >
                              <i className='material-icons left'>edit</i>Select
                              Image
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className='col s12 m7 l6 xl7'>
                        <div className='col s12'>
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
                        <div className='col s12'>
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
                        <div className='col s12'>
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
                        <div className='col s12'>
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
                      </div>
                    </div>
                    <div className='row' style={{ margin: "0px" }}>
                      <div className='col s10 offset-m1 m9'>
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
                      <div className='col s2 m1' style={{ marginTop: "15px" }}>
                        <ActionBtn
                          id='passwordBtn'
                          icon={"edit"}
                          onClick={(e) => {
                            e.preventDefault();
                            enableElem("password");
                            disableElem("name");
                            disableElem("email");
                            disableElem("member_type");
                            disableElem("acc_status");
                            hideElem("passwordBtn");
                          }}
                          className={"action-btn tooltipped"}
                          data-position='top'
                          data-tooltip='Edit Password'
                          size={"small"}
                          color={Color.shadow}
                        />
                      </div>
                    </div>
                    <div className='col s12 offset-m1 m5'>
                      <SelectContainer
                        id='member_type'
                        name='member_type'
                        list={memberTypeDropdown}
                        value={member_type}
                        text='Select member type'
                        onChange={onChange}
                      />
                    </div>
                    <div className='col s12 m5'>
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
                    <div className='col s12 offset-m1 m3'>
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
                    <div className='col s12 m3'>
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
                    <div className='col s5 offset-m1 m2'>
                      <FormSubmitButton
                        text={`${current ? "Update" : "Add"}`}
                      />
                    </div>
                    <div className='col s5 m2'>
                      <ButtonContainer
                        text={"Close"}
                        link={"/"}
                        onClick={() => props.clearCurrent()}
                        style={{
                          backgroundColor: "transparent",
                          color: Color.dangerHex,
                          width: "100%",
                        }}
                      />
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

const useStyles = makeStyles((theme) => ({
  large: {
    marginTop: theme.spacing(2),
    width: theme.spacing(18),
    height: theme.spacing(18),
  },
}));

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
