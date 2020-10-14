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
  Modal,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
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
  
  function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const [modalStyle] = useState(getModalStyle);
  // For Modal
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


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
      <div className='row' style={{ marginBottom: "0px", marginRight: "10px" }}>
        <div className='col m4 l3 hide-on-small-only'>
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
        </div>
        <div className='col m4 l3 hide-on-small-only'>
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
        </div>
        <div className='col m4 l3 hide-on-small-only'>
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
        <div className='col s12 m3'>
          <div
            className='hide-on-med-and-up'
            style={{
              float: "right",
            }}
          >
            <StyledTooltip title='Filters' placement='top' arrow>
              <IconButton
                aria-label='filters'
                onClick={handleOpen}
              >
                <i className={`material-icons`}>filter_list</i>
              </IconButton>
            </StyledTooltip>
          </div>
        </div>
      </div>
      {/* Members Cards */}
      <div className='row'>
        {loading && (
          <ul style={listStyle}>
            <li>
              <div class='collapsible-header' style={listItemStyle}>
                <i class='material-icons'>schedule</i>
                <span>Loading...</span>
              </div>
            </li>
          </ul>
        )}
        {(!loading && members.length === 0) || (!loading && onscreenmembers.length === 0) ? (
          <ul style={listStyle}>
            <li>
              <div class='collapsible-header' style={listItemStyle}>
                <i class='material-icons'>error_outline</i>
                <span>No record found....</span>
              </div>
            </li>
          </ul>
        ) : (
          onscreenmembers.map((obj) => (
            <div className='col s12 m6 l4'>
              <Card className={classes.card} style={{ boxShadow: "none" }}>
                <CardHeader
                  avatar={
                    <Avatar
                      alt={obj.name ? obj.name.charAt(0).toUpperCase() : "X"}
                      src={obj.memberImage}
                      className={classes.large}
                    />
                  }
                  title={
                    obj.name.length > 40
                      ? obj.name.substring(0, 40) + "..."
                      : obj.name
                  }
                  subheader={
                    obj.email.length > 40
                      ? obj.email.substring(0, 40) + "..."
                      : obj.email
                  }
                />
                <CardContent>
                  <Typography
                    variant='body2'
                    color='textSecondary'
                    component='p'
                  >
                    <span style={{ fontWeight: "bold" }}>Roll No:</span>{" "}
                    {obj._id}
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        <div style={modalStyle} className={classes.paper}>
          <SubHeader
            text={"Filter Members"}
            style={{ fontSize: "1.2em" }}
          />
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
        </div>
      </Modal>
    </Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  card: {
    background: Color.itemColor,
    marginBottom: 20,
    borderRadius: 10,
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  paper: {
    position: "absolute",
    width: 350,
    backgroundColor: Color.backgorundColor,
    boxShadow: theme.shadows[5],
    border: "0px",
    borderRadius: 10,
    outline: 'none' 
  },
}));

const StyledTooltip = withStyles({
  tooltip: {
    fontSize: "1rem",
  },
})(Tooltip);

const inputStyle = {
  backgroundColor: Color.inputColor,
  borderStyle: "none",
  borderBottom: "1px solid black",
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
