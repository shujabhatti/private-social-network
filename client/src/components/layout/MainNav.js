import React, { Fragment, useEffect, useState } from "react";
import SideBarItem from "./SideBarItem";
import Color from "../constants/Colors";
import ImageContainer from "./ImageContainer";
import InputContainer from "./InputContainer";
import LabelContainer from "./LabelContainer";
import FormSubmitButton from "./FormSubmitButton";
import ButtonContainer from "./ButtonContainer";

import {
  loadUser,
  updateUser,
  clearErrors,
  logout,
} from "../../actions/authActions";
import { clearMembers } from "../../actions/memberActions";

import {
  Badge,
  Avatar,
  Typography,
  Popper,
  Fade,
  Paper,
} from "@material-ui/core";

import PopupState, { bindToggle, bindPopper } from "material-ui-popup-state";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import M from "materialize-css/dist/js/materialize.min.js";
import {Link} from 'react-router-dom';

import PropTypes from "prop-types";
import { connect } from "react-redux";

const selectedItem = (selItem) => {
  var elem = document.getElementById(selItem);
  if (elem) {
    elem.style.backgroundColor = Color.selectedColor;
    elem.childNodes[0].style.color = Color.darkColor;
    elem.childNodes[0].childNodes[0].style.color = Color.darkColor;
  }
};

const MainNav = (props) => {
  const { isAuthenticated, user, returnmessage } = props;

  const initialInputs = {
    name: "",
    email: "",
    userImage: "",
  };

  const [userInp, setUserInp] = useState(initialInputs);
  const [showImage, setShowImage] = useState("");

  const { name, email } = userInp;

  const onChange = (e) =>
    setUserInp({ ...userInp, [e.target.name]: e.target.value });

  const classes = useStyles();

  useEffect(() => {
    selectedItem(props.selItem);
    if (user) {
      setUserInp(user);
      setShowImage(user.userImage);
    }

    if (returnmessage === "Changes Saved..!") {
      M.toast({ html: `${returnmessage}` });
      props.clearErrors();
      props.loadUser();
    }

    // eslint-disable-next-line
  }, [user, returnmessage]);

  const onLogout = () => {
    props.clearMembers();
    props.logout();
  };

  const loadFile = (e) => {
    if (e.target.files[0]) {
      const createPath = URL.createObjectURL(e.target.files[0]);
      if (createPath) {
        setUserInp({ ...userInp, userImage: e.target.files[0] });
        setShowImage(createPath);
      } else {
        setShowImage("");
      }
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    props.updateUser(userInp);
  };

  const openSideNav = () => {
    var elem = document.querySelector(".sidenav");
    var instance = new M.Sidenav(elem);
    instance.open();
  };

  const onlineUser = (
    <Fragment>
      <div className={classes.root}>
        <PopupState variant='popper' popupId='demo-popup-popper'>
          {(popupState) => (
            <div>
              <StyledBadge
                overlap='circle'
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                variant='dot'
              >
                <Avatar
                  alt={`${user && user.name}`}
                  src={user.userImage && user.userImage}
                  style={{ cursor: "pointer" }}
                  {...bindToggle(popupState)}
                />
              </StyledBadge>
              <Popper
                {...bindPopper(popupState)}
                transition
                className={`${classes.popper} z-depth-4`}
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={500}>
                    <Paper>
                      <Typography className={classes.typography}>
                        <div className='row'>
                          <form onSubmit={onSubmit}>
                            <LabelContainer
                              name='email'
                              value={email}
                              text=''
                              skipColon={true}
                              style={{ display: "block", textAlign: "center" }}
                            />
                            <Avatar
                              alt={name && name.charAt(0).toUpperCase()}
                              src={showImage}
                              className={classes.large}
                            />
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

                            {/* User Name Section */}
                            <InputContainer
                              type='text'
                              name='name'
                              value={name}
                              text='Username'
                              onChange={onChange}
                              style={{ backgroundColor: Color.lightColor }}
                            />
                            <Link to={"/change-password"} style={{float: 'right', marginBottom: '10px', fontWeight: 'bold'}}>Change Password?</Link>
                            <FormSubmitButton
                              icons={"done_outline"}
                              text={"Save Changes"}
                              {...bindToggle(popupState)}
                            />
                            <ButtonContainer
                              icons={"exit_to_app"}
                              text={"Logout"}
                              onClick={onLogout}
                              link={"/login"}
                              style={{
                                marginTop: "10px",
                                width: "100%",
                                backgroundColor: Color.dangerColor,
                              }}
                            />
                          </form>
                        </div>
                      </Typography>
                    </Paper>
                  </Fade>
                )}
              </Popper>
            </div>
          )}
        </PopupState>
      </div>
      <div></div>
    </Fragment>
  );

  const authLinks = (
    <Fragment>
      <SideBarItem id={"home-id"} icon={"group"} text={"Members"} />
      <SideBarItem
        id={"news-id"}
        icon={"assignment"}
        text={`News Feeds`}
        link={"/news"}
      />
      <SideBarItem
        id={"group-id"}
        icon={"group_add"}
        text={`Groups`}
        link={"/groups"}
      />
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <SideBarItem
        id={"login-id"}
        text={"Login"}
        icon={"lock"}
        link={"/login"}
      />
      <SideBarItem
        id={"reg-id"}
        text={"Register User"}
        icon={"assignment_turned_in"}
        link={"/register"}
      />
    </Fragment>
  );

  return (
    <Fragment>
      <nav style={{ background: Color.sideNavColor, boxShadow: "none" }}>
        <div className='nav-wrapper'>
          <h6
            href='#!'
            className='brand-logo center'
            style={{
              width: "100%",
              color: Color.darkColor,
            }}
          >
            <span
              className='hide-on-med-and-down'
              style={{ paddingLeft: "15%" }}
            >
              {props.title}
            </span>
            <span className='show-on-medium hide-on-small-only hide-on-large-only'>
              {props.title1}
            </span>
            <span className='show-on-small hide-on-med-and-up'>
              {props.title2}
            </span>
          </h6>
          <a
            href='#!'
            className='sidenav-trigger'
            data-target='side-nav'
            onClick={openSideNav}
          >
            <i className='material-icons' style={{ color: Color.darkColor }}>
              menu
            </i>
          </a>
          <ul class='right'>
            <li>{isAuthenticated && props.showUserAvatar && onlineUser}</li>
          </ul>
        </div>
      </nav>
      <ul
        className='sidenav sidenav-fixed'
        id='side-nav'
        style={{ backgroundColor: Color.sideNavColor }}
      >
        <li style={{ textAlign: "center" }}>
          <ImageContainer
            className='responsive-img'
            src={require("../images/dashboard.png")}
            style={{
              width: "auto",
              height: "150px",
              marginTop: "15px",
            }}
            alt='Logo'
          />
        </li>
        <div className='divider'></div>
        {isAuthenticated ? authLinks : guestLinks}
      </ul>
    </Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
    marginRight: theme.spacing(6),
    marginTop: theme.spacing(-1),
  },
  tooltip: {
    fontSize: "3em",
  },
  typography: {
    padding: theme.spacing(2),
  },
  popper: {
    minWidth: 250,
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2),
    borderRadius: "5px",
  },
  large: {
    marginTop: theme.spacing(2),
    width: theme.spacing(15),
    height: theme.spacing(15),
    margin: "auto",
  },
  input: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

MainNav.defaultProps = {
  // selItem: "home-id",
  showUserAvatar: true,
};

MainNav.propTypes = {
  selItem: PropTypes.string,
  loadUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  clearMembers: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
  returnmessage: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  returnmessage: state.auth.returnmessage,
  error: state.auth.error,
});

const mapDispatchToProps = (dispatch) => {
  return {
    loadUser: () => dispatch(loadUser()),
    updateUser: (obj) => dispatch(updateUser(obj)),
    logout: (obj) => dispatch(logout(obj)),
    clearMembers: () => dispatch(clearMembers()),
    clearErrors: () => dispatch(clearErrors()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainNav);
