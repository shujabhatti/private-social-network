import React, { Fragment, useEffect, useState } from "react";
import MainNav from "../../layout/MainNav";
import SubHeader from "../../layout/SubHeader";
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
  const [confirmDialog, setConfirmDialog] = useState(false);

  const initialInputs = {
    _id: "",
    title: "",
    description: "",
    create_date: "",
  };

  const [news, setNews] = useState(initialInputs);

  const { _id, title, description, create_date } = news;

  const onChange = (e) => setNews({ ...news, [e.target.name]: e.target.value });

  const { current, error, returnmessage } = props;

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
    } else if (returnmessage === "News updated!") {
      M.toast({ html: `${returnmessage}` });
      props.clearErrors();
      props.history.push("/news");
    }

    if (current) {
      setNews(current);
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
    setConfirmDialog(true);
  };

  const onConfirm = () => {
    if (!current) {
      if (title === "" || description === "") {
        M.toast({ html: "Please enter all fields!" });
      } else {
        props.addNews({ title, description });
      }
    } else if (current) {
      if (_id === "" || title === "" || description === "") {
        M.toast({ html: "Please enter all fields!" });
      } else {
        props.updateNews({
          _id,
          title,
          description,
        });
      }
    }
    onConfirmDialogClose();
  };

  return (
    <Fragment>
      <MainNav selItem={"news-id"} />
      <div className='main'>
        <div className='row'>
          <SubHeader
            text={`News Administrator - [${
              current ? "Update News" : "Add News"
            }]`}
            style={{ textAlign: "left", paddingLeft: "20px" }}
          />
          <div className='row'>
            <div className='col s10 offset-s1 m8 offset-m2'>
              <FormLayout>
                <div className='row'>
                  <form onSubmit={onSubmit}>
                    <div className='row' style={{ marginBottom: "0px" }}>
                      <div style={{ marginLeft: "20px", marginRight: "25px" }}>
                        <InputContainer
                          id='title'
                          type='text'
                          name='title'
                          value={title}
                          text='Title'
                          onChange={onChange}
                          labelClass={`${title !== "" ? "active" : ""}`}
                        />
                      </div>
                    </div>
                    <div className='row' style={{ marginBottom: "0px" }}>
                      <div style={{ marginLeft: "20px", marginRight: "20px" }}>
                        <TextAreaContainer
                          id='description'
                          name='description'
                          value={description}
                          text='Desciption'
                          onChange={onChange}
                          labelClass={`${description !== "" ? "active" : ""}`}
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
                          backgroundColor: Color.primaryHex,
                        }}
                      />
                      <ButtonContainer
                        icons={"close"}
                        text={"Close"}
                        link={"/news"}
                        onClick={() => props.clearCurrent()}
                        style={{
                          color: Color.dangerHex,
                          backgroundColor: "transparent",
                          width: "auto",
                          marginLeft: "20px",
                          marginRight: "10px",
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
        title='Update News'
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
