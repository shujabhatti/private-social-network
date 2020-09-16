import React, { Fragment, useEffect } from "react";
import SideBarItem from "./SideBarItem";
import Color from "../constants/Colors";
import ImageContainer from "./ImageContainer";

import { logout } from "../../actions/authActions";
import { clearMembers } from "../../actions/memberActions";

import { titleCase } from "../../helperFunctions";

import { Badge, Avatar, Tooltip } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import PropTypes from "prop-types";
import { connect } from "react-redux";

const selectedItem = (selItem) => {
  var elem = document.getElementById(selItem);
  if (elem) {
    elem.style.backgroundColor = Color.primaryHex;
    elem.childNodes[0].style.color = Color.fore;
    elem.childNodes[0].childNodes[0].style.color = Color.fore;
  }
};

const MainNav = (props) => {
  const { isAuthenticated, user } = props;

  const classes = useStyles();

  useEffect(() => {
    selectedItem(props.selItem);
    // eslint-disable-next-line
  }, []);

  const onLogout = () => {
    props.clearMembers();
    props.logout();
  };

  const onlineUser = (
    <Fragment>
      <div className={classes.root}>
        <StyledBadge
          overlap='circle'
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          variant='dot'
        >
          <StyledTooltip title={titleCase(`${user && user.name}`)} arrow>
            <Avatar
              alt={`${user && user.name}`}
              src=''
              onClick={() => console.log(user)}
              style={{ cursor: "pointer" }}
            />
          </StyledTooltip>
        </StyledBadge>
      </div>
    </Fragment>
  );

  const authLinks = (
    <Fragment>
      <li className='hide-on-large-only'>{onlineUser}</li>
      <SideBarItem id={"home-id"} icon={"groups"} text={"Members"} />
      <SideBarItem
        id={"news-id"}
        icon={"assignment"}
        text={`News Feeds`}
        link={"/news"}
      />
      <SideBarItem
        id={"change-pass-id"}
        text={"Change Password"}
        icon={"lock"}
        link={"/change-password"}
      />
      <SideBarItem
        id={"exit-id"}
        icon={"exit_to_app"}
        text={"Logout"}
        onClick={onLogout}
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
      <SideBarItem
        id={"about-id"}
        text={"About"}
        icon={"info"}
        link={"/about"}
      />
    </Fragment>
  );

  return (
    <Fragment>
      <nav style={{ background: Color.primaryHex }}>
        <div className='nav-wrapper'>
          <h6 href='#!' className='brand-logo center' style={{ width: "100%" }}>
            <span
              className='hide-on-med-and-down'
              style={{ paddingLeft: "15%" }}
            >
              Private Social Network - [Admin Portal]
            </span>
            <span className='show-on-medium hide-on-small-only hide-on-large-only'>
              PSN - [Admin Portal]
            </span>
            <span className='show-on-small hide-on-med-and-up'>
              Admin Portal
            </span>
          </h6>
          <a href='#!' className='sidenav-trigger' data-target='side-nav'>
            <i className='material-icons'>menu</i>
          </a>
          <ul class='right'>
            <li className='hide-on-med-and-down'>
              {isAuthenticated && onlineUser}
            </li>
          </ul>
        </div>
      </nav>
      <ul className='sidenav sidenav-fixed' id='side-nav'>
        <li>
          <ImageContainer
            className='responsive-img'
            src={require("../images/dashboard.png")}
            style={{
              width: "90%",
              height: "150px",
              marginTop: "15px",
              marginLeft: "15px",
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
    marginRight: theme.spacing(4),
  },
  tooltip: {
    fontSize: "3em",
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

const StyledTooltip = withStyles({
  tooltip: {
    fontSize: "1rem",
  },
})(Tooltip);

MainNav.defaultProps = {
  selItem: "home-id",
};

MainNav.propTypes = {
  selItem: PropTypes.string,
  logout: PropTypes.func.isRequired,
  clearMembers: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  error: state.auth.error,
});

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (obj) => dispatch(logout(obj)),
    clearMembers: () => dispatch(clearMembers()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainNav);
