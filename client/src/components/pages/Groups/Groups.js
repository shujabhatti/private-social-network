import React, { Fragment, useEffect, useState } from "react";
import MainNav from "../../layout/MainNav";
import InputContainer from "../../layout/InputContainer";
import ConfirmationDialogue from "../../layout/ConfirmationDialogue";
import { Link } from "react-router-dom";

import { loadUser } from "../../../actions/authActions";
import {
  getGroupsList,
  setOnScreenGroups,
  clearGroups,
  clearCurrent,
  setCurrent,
  deleteGroup,
  clearErrors,
} from "../../../actions/groupActions";

import Moment from "react-moment";

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

const Groups = (props) => {
  const [titlefil, setTitleFil] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [currentGroupID, setCurrentGroupID] = useState("");

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
      props.getGroupsList();
    } else {
      props.clearGroups();
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
      props.setOnScreenGroups(records);
    } else {
      const result = records.filter((d) => filterCombiner(d, filterValArray));
      props.setOnScreenGroups(result);
    }
  };

  const onEdit = (obj) => {
    props.setCurrent(obj);
    props.history.push("/group-administrator");
  };

  const onDelete = (id) => {
    setConfirmDialog(true);
    setCurrentGroupID(id);
  };

  const onConfirmDialogClose = () => {
    setConfirmDialog(false);
  };

  const onConfirm = () => {
    props.deleteGroup(currentGroupID);
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
      <MainNav selItem={"group-id"} title={"Groups Management"} title1={"Groups Management"} title2={'Groups'} />
      <div className='main'>
        <div className='row'>
          <div className='row'>
            <div className='col s10 offset-s1'>
              {/* Filter Container */}
              <div className='row'>
                <div className='col s12 m6'>
                  <InputContainer
                    type='text'
                    name='titlefil'
                    value={titlefil}
                    text='Search by group title.....'
                    onChange={(e) => setTitleFil(e.target.value)}
                    onKeyUp={() => onScreenFilter()}
                    onPaste={() => onScreenFilter()}
                    style={inputStyle}
                  />
                </div>
              </div>
              {/* Groups List */}
              <div className='row'>
                <ul style={listStyle}>
                  {loading && (
                    <li>
                      <div class='collapsible-header' style={listItemStyle}>
                        <i class='material-icons'>schedule</i>
                        <span>Loading...</span>
                      </div>
                    </li>
                  )}
                  {(!loading && records.length === 0) || (!loading && onscreenrecords.length === 0) ? (
                    <li>
                      <div class='collapsible-header' style={listItemStyle}>
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
                        <li className='collection-item' style={listItemStyle}>
                          <div
                            className='row'
                            style={{ height: "55px", marginBottom: "10px" }}
                          >
                            <div className='col s10'>
                              <CardHeader
                                style={{
                                  padding: "0px",
                                  paddingTop: "8px",
                                  paddingLeft: "15px",
                                }}
                                avatar={
                                  <Avatar
                                    alt={
                                      obj.title
                                        ? obj.title.charAt(0).toUpperCase()
                                        : "X"
                                    }
                                    src={obj.groupImage}
                                    className={classes.large}
                                  />
                                }
                                title={
                                  <span className='grey-text'>
                                    <span
                                      onClick={onEdit.bind(this, obj)}
                                      style={titleStyle}
                                    >
                                      {obj.title.length > 40
                                        ? obj.title.substring(0, 40) + "..."
                                        : obj.title}
                                    </span>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <span className='black-text'>
                                      Created on
                                    </span>{" "}
                                    <Moment format='MMMM Do YYYY, h:mm:ss a'>
                                      {obj.create_date}
                                    </Moment>
                                  </span>
                                }
                              />
                            </div>
                            <div className='col s2'>
                              <a
                                href='#!'
                                onClick={onDelete.bind(this, obj._id)}
                                className='secondary-content'
                                style={{
                                  paddingTop: "10px",
                                  paddingRight: "15px",
                                }}
                              >
                                <i className='material-icons grey-text'>
                                  delete
                                </i>
                              </a>
                            </div>
                          </div>
                        </li>
                      ))
                  )}
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
                  labelRowsPerPage={"Groups Per Page:"}
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
          <StyledTooltip title='Add Group' placement='left' arrow>
            <Link to={"/group-administrator"}>
              <IconButton
                aria-label='filters'
                onClick={() => props.clearCurrent()}
                style={{
                  backgroundColor: Color.primaryColor,
                  color: Color.lightColor,
                }}
              >
                <i className={`material-icons`}>add</i>
              </IconButton>
            </Link>
          </StyledTooltip>
        </div>
        <ConfirmationDialogue
          open={confirmDialog}
          onConfirmDialogClose={onConfirmDialogClose}
          title='Delete Group'
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
  borderStyle: "none",
  borderBottom: "1px solid black",
};

const titleStyle = {
  color: Color.primaryColor,
  cursor: "pointer",
  fontWeight: "bold",
};

const listItemStyle = {
  boxShadow: "none",
  backgroundColor: Color.itemColor,
  borderRadius: "10px",
};

const listStyle = {
  marginLeft: "10px",
  marginRight: "10px",
};

Groups.propTypes = {
  loadUser: PropTypes.func.isRequired,
  getGroupsList: PropTypes.func.isRequired,
  setOnScreenGroups: PropTypes.func.isRequired,
  setCurrent: PropTypes.func.isRequired,
  deleteGroup: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  clearCurrent: PropTypes.func.isRequired,
  clearGroups: PropTypes.func.isRequired,
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
  records: state.groups.records,
  loading: state.groups.loading,
  onscreenrecords: state.groups.onscreenrecords,
  returnmessage: state.groups.returnmessage,
});

const mapDispatchToProps = (dispatch) => {
  return {
    loadUser: () => dispatch(loadUser()),
    getGroupsList: () => dispatch(getGroupsList()),
    setOnScreenGroups: (obj) => dispatch(setOnScreenGroups(obj)),
    setCurrent: (obj) => dispatch(setCurrent(obj)),
    deleteGroup: (id) => dispatch(deleteGroup(id)),
    clearErrors: () => dispatch(clearErrors()),
    clearCurrent: () => dispatch(clearCurrent()),
    clearGroups: () => dispatch(clearGroups()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
