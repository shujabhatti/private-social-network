import React, { Fragment, useEffect, useState } from "react";
import MainNav from "../../layout/MainNav";
import FormLayout from "../../layout/FormLayout";
import InputContainer from "../../layout/InputContainer";
import LabelContainer from "../../layout/LabelContainer";
import TextAreaContainer from "../../layout/TextAreaContainer";
import FormSubmitButton from "../../layout/FormSubmitButton";
import ButtonContainer from "../../layout/ButtonContainer";
import ConfirmationDialogue from "../../layout/ConfirmationDialogue";
import Color from "../../constants/Colors";

import { loadUser } from "../../../actions/authActions";
import {
  addNews,
  updateNews,
  clearCurrent,
  clearErrors,
} from "../../../actions/newsActions";

import { hideElem } from "../../../helperFunctions";

import Moment from "react-moment";
import M from "materialize-css/dist/js/materialize.min.js";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const NewsAdministrator = (props) => {
  const initialInputs = {
    _id: "",
    title: "",
    description: "",
    newsImage: "",
    create_date: "",
  };

  const [news, setNews] = useState(initialInputs);

  const { _id, title, description, newsImage, create_date } = news;

  const onChange = (e) => setNews({ ...news, [e.target.name]: e.target.value });

  const { current, error, returnmessage } = props;

  const [confirmDialog, setConfirmDialog] = useState(false);
  const [showImage, setShowImage] = useState("");

  useEffect(() => {
    props.loadUser();

    if (error) {
      M.toast({ html: `${error}` });
      props.clearErrors();
    }

    if (returnmessage === "News added!") {
      M.toast({ html: `${returnmessage}` });
      props.clearErrors();
      setNews(initialInputs);
      setShowImage("");
    } else if (returnmessage === "News updated!") {
      M.toast({ html: `${returnmessage}` });
      props.clearErrors();
      props.history.push("/news");
    }

    if (current) {
      setNews(current);
      if (current.newsImage) {
        setShowImage(current.newsImage);
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
      if (title === "" || description === "") {
        M.toast({ html: "Please enter all fields!" });
      } else {
        setConfirmDialog(true);
      }
    } else if (current) {
      if (_id === "" || title === "" || description === "") {
        M.toast({ html: "Please enter all fields!" });
      } else {
        setConfirmDialog(true);
      }
    }
  };

  const onConfirm = () => {
    if (!current) {
      props.addNews({ title, description, newsImage });
    } else if (current) {
      props.updateNews({
        _id,
        title,
        description,
        newsImage,
      });
    }
    onConfirmDialogClose();
  };

  const loadFile = (e) => {
    if (e.target.files[0]) {
      const createPath = URL.createObjectURL(e.target.files[0]);
      if (createPath) {
        setNews({ ...news, newsImage: e.target.files[0] });
        setShowImage(createPath);
      } else {
        setShowImage("");
      }
    }
  };

  return (
    <Fragment>
      <MainNav
        selItem={"news-id"}
        title={`News Administrator - [${current ? "Update News" : "Add News"}]`}
        title1={`${current ? "Update News" : "Add News"}`}
        title2={"News"}
        showUserAvatar={false}
      />
      <div className='main'>
        <div className='row'>
          <div className='row'>
            <div className='col xs12 s10 offset-s1 m10 offset-m1 l10 offset-l1 xl8 offset-xl2'>
              <FormLayout>
                <div className='row'>
                  <form onSubmit={onSubmit}>
                    <div className='row'>
                      <div className='col s12 m4'>
                        <div className='row'>
                          {/* Image Section */}
                          <div
                            className='col offset-s1 m12'
                            style={{ textAlign: "center", marginTop: "20px" }}
                          >
                            <img
                              alt='News'
                              src={
                                showImage
                                  ? showImage
                                  : "https://icon-library.com/images/image-placeholder-icon/image-placeholder-icon-13.jpg"
                              }
                              style={{
                                maxHeight: "230px",
                                maxWidth: "200px",
                                border: "1px solid black",
                                borderStyle: "dashed",
                              }}
                            />
                          </div>
                          <div
                            className='col s5 m12'
                            style={{ textAlign: "center" }}
                          >
                            <div
                              className='input-field'
                              id='change-image-container'
                              style={{ display: "inline-block" }}
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
                                Select Image
                                <span className='material-icons right'>
                                  edit
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col s12 m8'>
                        <div className='row' style={{ marginBottom: "0px" }}>
                          <div
                            style={{ marginLeft: "20px", marginRight: "25px" }}
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
                        </div>
                        <div className='row' style={{ marginBottom: "0px" }}>
                          <div
                            style={{ marginLeft: "20px", marginRight: "20px" }}
                          >
                            <TextAreaContainer
                              id='description'
                              name='description'
                              value={description}
                              text='Desciption'
                              onChange={onChange}
                              style={{ minHeight: "200px", marginTop: "0px" }}
                            />
                          </div>
                        </div>
                        <div className='row' style={{ marginBottom: "0px" }}>
                          <div style={{ marginRight: "20px" }}>
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
                        </div>
                        <div className='row' style={{ marginTop: "20px" }}>
                          <FormSubmitButton
                            icons={`${current ? "edit" : "add"}`}
                            text={`${current ? "Update News" : "Add News"}`}
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
                            link={"/news"}
                            onClick={() => props.clearCurrent()}
                            style={{
                              width: "auto",
                              backgroundColor: Color.dangerColor,
                            }}
                          />
                        </div>
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
        title={`${current ? "Update News" : "Add News"}`}
        content='Are you sure you want to save changes?'
        onConfirm={onConfirm}
      />
    </Fragment>
  );
};

NewsAdministrator.propTypes = {
  current: PropTypes.object.isRequired,
  returnmessage: PropTypes.string.isRequired,
  loadUser: PropTypes.func.isRequired,
  addNews: PropTypes.func.isRequired,
  updateNews: PropTypes.func.isRequired,
  clearCurrent: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  current: state.news.current,
  error: state.news.error,
  returnmessage: state.news.returnmessage,
});

const mapDispatchToProps = (dispatch) => {
  return {
    loadUser: () => dispatch(loadUser()),
    addNews: (obj) => dispatch(addNews(obj)),
    updateNews: (obj) => dispatch(updateNews(obj)),
    clearCurrent: () => dispatch(clearCurrent()),
    clearErrors: () => dispatch(clearErrors()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsAdministrator);
