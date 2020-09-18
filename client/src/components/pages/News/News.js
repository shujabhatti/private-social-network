import React, { Fragment, useEffect, useState } from "react";
import MainNav from "../../layout/MainNav";
import SubHeader from "../../layout/SubHeader";
import InputContainer from "../../layout/InputContainer";
import ConfirmationDialogue from "../../layout/ConfirmationDialogue";
import { Link } from "react-router-dom";

import { loadUser } from "../../../actions/authActions";
import {
  getNewsList,
  setOnScreenNews,
  clearNews,
  clearCurrent,
  setCurrent,
  deleteNews,
  clearErrors,
} from "../../../actions/newsActions";

import {
  TablePagination,
  Tooltip,
  IconButton,
  Avatar,
  CardHeader,
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";

import M from "materialize-css/dist/js/materialize.min.js";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Color from "../../constants/Colors";

const News = (props) => {
  const [titlefil, setTitleFil] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [currentNewsID, setCurrentNewsID] = useState("");

  const {
    isAuthenticated,
    error,
    records,
    loading,
    returnmessage,
    onscreenrecords,
  } = props;

  useEffect(() => {
    M.AutoInit();

    props.loadUser();
    if (isAuthenticated) {
      props.getNewsList();
    } else {
      props.clearNews();
    }

    if (returnmessage) {
      M.toast({ html: `${returnmessage}` });
      props.clearErrors();
    }

    if (error) {
      M.toast({ html: `${error}` });
    }
    // eslint-disable-next-line
  }, [isAuthenticated, error, returnmessage]);

  const filterCombiner = (d, filterArray) => {
    for (let fn of filterArray) {
      if (!fn(d)) {
        return false;
      }
    }
    return true;
  };

  const onScreenFilter = () => {
    const filterValArray = [
      (d) => d.title && d.title.toLowerCase().includes(titlefil.toLowerCase()),
    ];

    if (titlefil === "") {
      props.setOnScreenNews(records);
    } else {
      const result = records.filter((d) => filterCombiner(d, filterValArray));
      props.setOnScreenNews(result);
    }
  };

  const onEdit = (obj) => {
    props.setCurrent(obj);
    props.history.push("/news-administrator");
  };

  const onDelete = (id) => {
    setConfirmDialog(true);
    setCurrentNewsID(id);
  };

  const onConfirmDialogClose = () => {
    setConfirmDialog(false);
  };

  const onConfirm = () => {
    props.deleteNews(currentNewsID);
    onConfirmDialogClose();
  };

  //#region Pagination Functions

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  //#endregion

  const classes = useStyles();

  return (
    <Fragment>
      <MainNav selItem={"news-id"} />
      <div className='main'>
        <div className='row'>
          <SubHeader
            text={"News Module"}
            style={{ textAlign: "left", paddingLeft: "20px" }}
          />
          <div className='row'>
            <div className='col s10 offset-s1'>
              {/* Filter Container */}
              <div className='row'>
                <div className='col s8 m3'>
                  <InputContainer
                    type='text'
                    name='titlefil'
                    value={titlefil}
                    text='Title'
                    onChange={(e) => setTitleFil(e.target.value)}
                    onKeyUp={() => onScreenFilter()}
                    onPaste={() => onScreenFilter()}
                    style={inputStyle}
                  />
                </div>
              </div>
              {/* News Cards */}
              <div className='row'>
                <ul class='collapsible popout'>
                  {loading && (
                    <li>
                      <div class='collapsible-header'>
                        <i class='material-icons'>schedule</i>
                        <span>Loading...</span>
                      </div>
                    </li>
                  )}
                  {!loading && records.length === 0 ? (
                    <li>
                      <div class='collapsible-header'>
                        <i class='material-icons'>error_outline</i>
                        <span>No record found....</span>
                      </div>
                    </li>
                  ) : (
                    onscreenrecords
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((obj) => (
                        <li>
                          <div
                            class='collapsible-header'
                            style={{ height: "70px" }}
                          >
                            <CardHeader
                              avatar={
                                <Avatar
                                  alt={
                                    obj.title
                                      ? obj.title.charAt(0).toUpperCase()
                                      : "X"
                                  }
                                  src={obj.newsImage}
                                  className={classes.large}
                                />
                              }
                              title={
                                <span
                                  onClick={onEdit.bind(this, obj)}
                                  style={titleStyle}
                                >
                                  {obj.title}
                                </span>
                              }
                            />
                          </div>
                          <div class='collapsible-body'>
                            <span>{obj.description}</span>
                            <a
                              href='#!'
                              onClick={onDelete.bind(this, obj._id)}
                              className='secondary-content'
                            >
                              <i className='material-icons grey-text'>delete</i>
                            </a>
                          </div>
                        </li>
                      ))
                  )}
                  {}
                </ul>
                <TablePagination
                  rowsPerPageOptions={[
                    5,
                    10,
                    25,
                    50,
                    100,
                    { value: onscreenrecords.length, label: "All" },
                  ]}
                  component='div'
                  count={onscreenrecords.length}
                  labelRowsPerPage={"News Per Page:"}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  style={{ margin: "0 24px" }}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className='row'
          style={{ position: "absolute", bottom: "10px", right: "20px" }}
        >
          <StyledTooltip title='Add News' placement='left' arrow>
            <Link to={"/news-administrator"}>
              <IconButton
                aria-label='filters'
                onClick={() => props.clearCurrent()}
                style={{ backgroundColor: Color.primaryHex, color: Color.fore }}
              >
                <i className={`material-icons`}>add</i>
              </IconButton>
            </Link>
          </StyledTooltip>
        </div>
        <ConfirmationDialogue
          open={confirmDialog}
          onConfirmDialogClose={onConfirmDialogClose}
          title='Delete News'
          content='Are you sure you want to delete this?'
          onConfirm={onConfirm}
        />
      </div>
    </Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
}));

const StyledTooltip = withStyles({
  tooltip: {
    fontSize: "1rem",
  },
})(Tooltip);

const inputStyle = {
  backgroundColor: "transparent",
  borderStyle: "none",
  borderBottom: "1px solid black",
};

const titleStyle = {
  color: Color.primaryHex,
  cursor: "pointer",
  fontWeight: "bold",
};

News.propTypes = {
  loadUser: PropTypes.func.isRequired,
  getNewsList: PropTypes.func.isRequired,
  setOnScreenNews: PropTypes.func.isRequired,
  setCurrent: PropTypes.func.isRequired,
  deleteNews: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  clearCurrent: PropTypes.func.isRequired,
  clearNews: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
  returnmessage: PropTypes.string.isRequired,
  records: PropTypes.array.isRequired,
  onscreenrecords: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.auth.error,
  records: state.news.records,
  loading: state.news.loading,
  onscreenrecords: state.news.onscreenrecords,
  returnmessage: state.news.returnmessage,
});

const mapDispatchToProps = (dispatch) => {
  return {
    loadUser: () => dispatch(loadUser()),
    getNewsList: () => dispatch(getNewsList()),
    setOnScreenNews: (obj) => dispatch(setOnScreenNews(obj)),
    setCurrent: (obj) => dispatch(setCurrent(obj)),
    deleteNews: (id) => dispatch(deleteNews(id)),
    clearErrors: () => dispatch(clearErrors()),
    clearCurrent: () => dispatch(clearCurrent()),
    clearNews: () => dispatch(clearNews()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(News);
