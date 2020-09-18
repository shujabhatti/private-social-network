import React, { Fragment, useState, useEffect } from "react";
import InputContainer from "../layout/InputContainer";
import ConfirmationDialogue from "../layout/ConfirmationDialogue";
import SubHeader from "../layout/SubHeader";
import Color from "../constants/Colors";
import Moment from "react-moment";

import { useHistory } from "react-router-dom";

import {
  setOnScreenMembers,
  setCurrent,
  deleteMember,
  clearErrors,
} from "../../actions/memberActions";

import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Tooltip,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import M from "materialize-css/dist/js/materialize.min.js";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const MembersTable = (props) => {
  //#region Hooks and fetched properties

  let history = useHistory();

  const members = props.tbData;

  const { onscreenmembers, returnmessage, loading } = props;

  // On screen filters hooks
  const [idfil, setIDFil] = useState("");
  const [namefil, setNameFil] = useState("");
  const [emailfil, setEmailFil] = useState("");
  // Hook to handle Confirmation Dialog
  const [confirmDialog, setConfirmDialog] = useState(false);
  // Hook to get current member ID
  const [currentMemberID, setCurrentMemberID] = useState("");
  // On Opening / Closing Filter Dialog
  const [filterDialog, setFilterDialog] = useState(false);

  //#endregion

  useEffect(() => {
    if (returnmessage === "Member deleted successfully...!") {
      M.toast({ html: `${returnmessage}` });
      props.clearErrors();
    }
    // eslint-disable-next-line
  }, [returnmessage]);

  //#region Functions

  const onEdit = (obj) => {
    props.setCurrent(obj);
    history.push("/member-administrator");
  };

  const onDelete = (id) => {
    setConfirmDialog(true);
    setCurrentMemberID(id);
  };

  const onConfirmDialogClose = () => {
    setConfirmDialog(false);
  };

  const onConfirm = () => {
    props.deleteMember(currentMemberID);
    onConfirmDialogClose();
  };

  const onFilterDialogClose = () => {
    setFilterDialog(false);
  };

  //#region On Screen Filters Function

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
      (d) => d._id && d._id.toLowerCase().includes(idfil.toLowerCase()),
      (d) => d.name && d.name.toLowerCase().includes(namefil.toLowerCase()),
      (d) => d.email && d.email.toLowerCase().includes(emailfil.toLowerCase()),
    ];

    if (idfil === "" && namefil === "" && emailfil === "") {
      props.setOnScreenMembers(members);
    } else {
      const result = members.filter((d) => filterCombiner(d, filterValArray));
      props.setOnScreenMembers(result);
    }
  };

  //#endregion

  const classes = useStyles();

  //#endregion

  return (
    <Fragment>
      {/* Filter Button */}
      <div className='row' style={{ display: "flex", marginBottom: "0px" }}>
        <SubHeader
          text={"Members Records"}
          style={{ textAlign: "left", paddingLeft: "20px", width: "93%" }}
        />
        <div
          className='row'
          style={{
            float: "right",
            marginTop: "10px",
          }}
        >
          <StyledTooltip title='Filters' placement='top' arrow>
            <IconButton
              aria-label='filters'
              onClick={() => setFilterDialog(true)}
            >
              <i className={`material-icons`}>filter_list</i>
            </IconButton>
          </StyledTooltip>
        </div>
      </div>
      {/* Members Cards */}
      <div className='row'>
        {loading && (
          <ul class='collapsible popout'>
            <li>
              <div class='collapsible-header'>
                <i class='material-icons'>schedule</i>
                <span>Loading...</span>
              </div>
            </li>
          </ul>
        )}
        {!loading && members.length === 0 ? (
          <ul class='collapsible popout'>
            <li>
              <div class='collapsible-header'>
                <i class='material-icons'>error_outline</i>
                <span>No record found....</span>
              </div>
            </li>
          </ul>
        ) : (
          onscreenmembers.map((obj) => (
            <div className='col s12 m6 l4'>
              <Card className={classes.card}>
                <CardHeader
                  avatar={
                    <Avatar
                      alt={obj.name ? obj.name.charAt(0).toUpperCase() : "X"}
                      src={obj.memberImage}
                      className={classes.large}
                    />
                  }
                  title={obj.name}
                  subheader={obj.email}
                />
                <CardContent>
                  <Typography
                    variant='body5'
                    component='p'
                    className={classes.right}
                  >
                    <span style={{ fontWeight: "bold" }}>
                      {obj.member_type}
                    </span>
                  </Typography>
                  <br />
                  <Typography
                    variant='body2'
                    color='textSecondary'
                    component='p'
                  >
                    Roll No: {obj._id}
                  </Typography>
                  <Typography
                    variant='body2'
                    color='textSecondary'
                    component='p'
                  >
                    <Moment format='MMMM do YYYY, h:mm:ss a'>
                      {new Date(obj.create_date)}
                    </Moment>
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton
                    aria-label='add to favorites'
                    onClick={onEdit.bind(this, obj)}
                  >
                    <i className='material-icons'>edit</i>
                  </IconButton>
                  <IconButton
                    aria-label='add to favorites'
                    onClick={onDelete.bind(this, obj._id)}
                  >
                    <i className='material-icons'>delete</i>
                  </IconButton>
                </CardActions>
              </Card>
            </div>
          ))
        )}
      </div>
      {/* Delete Member Confirmation Dialog */}
      <ConfirmationDialogue
        open={confirmDialog}
        onConfirmDialogClose={onConfirmDialogClose}
        title='Delete Member'
        content='Are you sure you want to delete this?'
        onConfirm={onConfirm}
      />
      {/* Filter Dialog */}
      <Dialog
        open={filterDialog}
        onClose={onFilterDialogClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        className={classes.dialogContainer}
      >
        <DialogTitle id='alert-dialog-title'>Filter Members</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <div className='row' style={{ width: "250px" }}>
              <InputContainer
                type='text'
                name='idfil'
                value={idfil}
                text='Member ID'
                onChange={(e) => setIDFil(e.target.value)}
                onKeyUp={() => onScreenFilter()}
                onPaste={() => onScreenFilter()}
                style={inputStyle}
              />

              <InputContainer
                type='text'
                name='namefil'
                value={namefil}
                text='Member Name'
                onChange={(e) => setNameFil(e.target.value)}
                onKeyUp={() => onScreenFilter()}
                onPaste={() => onScreenFilter()}
                style={inputStyle}
              />

              <InputContainer
                type='text'
                name='emailfil'
                value={emailfil}
                text='Email Address'
                onChange={(e) => setEmailFil(e.target.value)}
                onKeyUp={() => onScreenFilter()}
                onPaste={() => onScreenFilter()}
                style={inputStyle}
              />
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  card: {
    background: Color.input,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
  },
  right: {
    float: "right",
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  dialogContainer: {
    opacity: "0.9",
    textAlign: "center",
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

MembersTable.propTypes = {
  onscreenmembers: PropTypes.object.isRequired,
  returnmessage: PropTypes.string.isRequired,
  setOnScreenMembers: PropTypes.func.isRequired,
  setCurrent: PropTypes.func.isRequired,
  deleteMember: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  onscreenmembers: state.member.onscreenmembers,
  returnmessage: state.member.returnmessage,
  loading: state.member.loading,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setOnScreenMembers: (obj) => dispatch(setOnScreenMembers(obj)),
    setCurrent: (obj) => dispatch(setCurrent(obj)),
    deleteMember: (id) => dispatch(deleteMember(id)),
    clearErrors: () => dispatch(clearErrors()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MembersTable);
