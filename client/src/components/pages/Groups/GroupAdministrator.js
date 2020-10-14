import React, { Fragment, useEffect, useState } from "react";
import MainNav from "../../layout/MainNav";
import FormLayout from "../../layout/FormLayout";
import InputContainer from "../../layout/InputContainer";
import LabelContainer from "../../layout/LabelContainer";
import FormSubmitButton from "../../layout/FormSubmitButton";
import ButtonContainer from "../../layout/ButtonContainer";
import ConfirmationDialogue from "../../layout/ConfirmationDialogue";
import Color from "../../constants/Colors";

import { loadUser } from "../../../actions/authActions";
import {
  addGroup,
  updateGroup,
  clearCurrent,
  clearErrors,
} from "../../../actions/groupActions";

import { hideElem } from "../../../helperFunctions";

import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Moment from "react-moment";
import M from "materialize-css/dist/js/materialize.min.js";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const GroupAdministrator = (props) => {
  const initialInputs = {
    _id: "",
    title: "",
    groupImage: "",
    create_date: "",
  };

  const [group, setGroup] = useState(initialInputs);

  const { _id, title, groupImage, create_date } = group;

  const onChange = (e) =>
    setGroup({ ...group, [e.target.name]: e.target.value });

  const { current, error, returnmessage } = props;

  const [confirmDialog, setConfirmDialog] = useState(false);
  const [showImage, setShowImage] = useState("");

  useEffect(() => {
    props.loadUser();

    if (error) {
      M.toast({ html: `${error}` });
      props.clearErrors();
    }

    if (returnmessage === "Group added!") {
      M.toast({ html: `${returnmessage}` });
      props.clearErrors();
      setGroup(initialInputs);
      setShowImage("");
    } else if (returnmessage === "Group updated!") {
      M.toast({ html: `${returnmessage}` });
      props.clearErrors();
      props.history.push("/groups");
    }

    if (current) {
      setGroup(current);
      if (current.groupImage) {
        setShowImage(current.groupImage);
      }
    } else {
      hideElem("create_date");
    }

    // eslint-disable-next-line
  }, [current, error, returnmessage]);

  const onConfirmDialogClose = () => {
    setConfirmDialog(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!current) {
      if (title === "") {
        M.toast({ html: "Please enter group title!" });
      } else {
        setConfirmDialog(true);
      }
    } else if (current) {
      if (_id === "" || title === "") {
        M.toast({ html: "Please enter group title!" });
      } else {
        setConfirmDialog(true);
      }
    }
  };

  const onConfirm = () => {
    if (!current) {
      props.addGroup({ title, groupImage });
    } else if (current) {
      props.updateGroup({
        _id,
        title,
        groupImage,
      });
    }
    onConfirmDialogClose();
  };

  const loadFile = (e) => {
    if (e.target.files[0]) {
      const createPath = URL.createObjectURL(e.target.files[0]);
      if (createPath) {
        setGroup({ ...group, groupImage: e.target.files[0] });
        setShowImage(createPath);
      } else {
        setShowImage("");
      }
    }
  };

  const classes = useStyles();

  return (
    <Fragment>
      <MainNav
        selItem={"group-id"}
        title={`Group Administrator - [${
          current ? "Update Group" : "Add Group"
        }]`}
        title1={`${current ? "Update Group" : "Add Group"}`}
        title2={"Groups"}
        showUserAvatar={false}
      />
      <div className='main'>
        <div className='row'>
          <div className='row'>
            <div className='col xs12 s10 offset-s1 m6 offset-m3 l5 offset-l3 xl4 offset-xl4'>
              <FormLayout>
                <div className='row'>
                  <form onSubmit={onSubmit}>
                    <div className='row'>
                      <div className='row'>
                        {/* Image Section */}
                        <Avatar
                          alt={title && title.charAt(0).toUpperCase()}
                          src={showImage}
                          className={classes.large}
                        />
                        <div>
                          <div
                            className='input-field'
                            id='change-image-container'
                            style={{
                              textAlign: "center",
                            }}
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
                              <i
                                className='material-icons'
                                style={{ verticalAlign: "bottom" }}
                              >
                                edit
                              </i>
                              Select Image
                            </label>
                          </div>
                        </div>
                      </div>
                      <div
                        className='row'
                        style={{
                          marginBottom: "0px",
                          marginLeft: "30px",
                          marginRight: "35px",
                        }}
                      >
                        <InputContainer
                          id='title'
                          type='text'
                          name='title'
                          value={title}
                          text='Title'
                          onChange={onChange}
                        />
                      </div>
                      <div
                        className='row'
                        style={{ marginBottom: "0px", marginRight: "30px" }}
                      >
                        <LabelContainer
                          id='create_date'
                          name='create_date'
                          value={
                            <Moment format='MMMM do YYYY, h:mm:ss a'>
                              {new Date(create_date)}
                            </Moment>
                          }
                          text='Create Date'
                          style={{
                            marginTop: "0px",
                            float: "right",
                          }}
                        />
                      </div>
                      <div
                        className='row'
                        style={{ marginTop: "20px", marginLeft: "30px" }}
                      >
                        <FormSubmitButton
                          icons={`${current ? "edit" : "add"}`}
                          text={`${current ? "Update Group" : "Add Group"}`}
                          style={{
                            marginLeft: "20px",
                            marginRight: "10px",
                            width: "auto",
                            backgroundColor: Color.primaryColor,
                          }}
                        />
                        <ButtonContainer
                          icons={"close"}
                          text={"Close"}
                          link={"/groups"}
                          onClick={() => props.clearCurrent()}
                          style={{
                            width: "auto",
                            backgroundColor: Color.dangerColor,
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
        title={`${current ? "Update Group" : "Add Group"}`}
        content='Are you sure you want to save changes?'
        onConfirm={onConfirm}
      />
    </Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(18),
    height: theme.spacing(18),
    margin: "auto",
    marginTop: theme.spacing(2),
  },
}));

GroupAdministrator.propTypes = {
  current: PropTypes.object.isRequired,
  returnmessage: PropTypes.string.isRequired,
  loadUser: PropTypes.func.isRequired,
  addGroup: PropTypes.func.isRequired,
  updateGroup: PropTypes.func.isRequired,
  clearCurrent: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  current: state.groups.current,
  error: state.groups.error,
  returnmessage: state.groups.returnmessage,
});

const mapDispatchToProps = (dispatch) => {
  return {
    loadUser: () => dispatch(loadUser()),
    addGroup: (obj) => dispatch(addGroup(obj)),
    updateGroup: (obj) => dispatch(updateGroup(obj)),
    clearCurrent: () => dispatch(clearCurrent()),
    clearErrors: () => dispatch(clearErrors()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupAdministrator);
