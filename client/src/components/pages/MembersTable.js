import React, { Fragment, useState, useEffect } from "react";
import InputContainer from "../layout/InputContainer";
import orderBy from "lodash/orderBy";
import Color from "../constants/Colors";
// import Moment from "react-moment";

import { useHistory } from "react-router-dom";

import {
  setOnScreenMembers,
  setCurrent,
  deleteMember,
  clearErrors,
} from "../../actions/memberActions";

import {
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";

import M from "materialize-css/dist/js/materialize.min.js";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const MembersTable = (props) => {
  //#region Hooks and fetched properties

  let history = useHistory();

  const members = props.tbData;

  const { onscreenmembers, returnmessage } = props;

  // For Setting Current Page of the Records
  const [page, setPage] = useState(0);
  // For Setting Rows Per Page for Pagination
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // On screen filters hooks
  const [idfil, setIDFil] = useState("");
  const [namefil, setNameFil] = useState("");
  const [emailfil, setEmailFil] = useState("");
  // For Setting Column to Sort
  const [columnToSort, setColumnToSort] = useState("");
  // For Setting Type of Sort for selected Column
  const [sortDirection, setSortDirecton] = useState("desc");

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
    props.deleteMember(id);
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

  //#region Pagination Functions

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, onscreenmembers.length - page * rowsPerPage);

  //#endregion

  //#region Sorting Functions

  const invertDirection = {
    asc: "desc",
    desc: "asc",
  };

  const handleSort = (columnName) => {
    setColumnToSort(columnName);
    if (columnToSort === columnName) {
      setSortDirecton(invertDirection[sortDirection]);
    } else {
      setSortDirecton("asc");
    }
  };

  //#endregion

  const classes = useStyles();

  //#endregion

  return (
    <Fragment>
      {/* Filter Container */}
      <div className='row'>
        <div className='col s12 m3'>
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
        <div className='col s12 m3'>
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
        <div className='col s12 m3'>
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
      {/* Table Container */}
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label='simple table'>
          <TableHead
            classes={{
              root: classes.root,
              label: classes.label,
            }}
          >
            <TableRow>
              <TableHeadCellStyle align='left'>
                <div onClick={() => handleSort("_id")} style={sortIconStyle}>
                  <span>Member ID</span>
                  {columnToSort === "_id" ? (
                    sortDirection === "asc" ? (
                      <span class='material-icons'>arrow_drop_up</span>
                    ) : (
                      <span class='material-icons'>arrow_drop_down</span>
                    )
                  ) : null}
                </div>{" "}
              </TableHeadCellStyle>
              <TableHeadCellStyle align='left'>
                <div onClick={() => handleSort("name")} style={sortIconStyle}>
                  <span>Member Name</span>
                  {columnToSort === "name" ? (
                    sortDirection === "asc" ? (
                      <span class='material-icons'>arrow_drop_up</span>
                    ) : (
                      <span class='material-icons'>arrow_drop_down</span>
                    )
                  ) : null}
                </div>{" "}
              </TableHeadCellStyle>
              <TableHeadCellStyle align='left'>
                <div onClick={() => handleSort("email")} style={sortIconStyle}>
                  <span>Email Address</span>
                  {columnToSort === "email" ? (
                    sortDirection === "asc" ? (
                      <span class='material-icons'>arrow_drop_up</span>
                    ) : (
                      <span class='material-icons'>arrow_drop_down</span>
                    )
                  ) : null}
                </div>{" "}
              </TableHeadCellStyle>
              <TableHeadCellStyle align='left'>
                <div
                  onClick={() => handleSort("create_date")}
                  style={sortIconStyle}
                >
                  <span>Create Date</span>
                  {columnToSort === "create_date" ? (
                    sortDirection === "asc" ? (
                      <span class='material-icons'>arrow_drop_up</span>
                    ) : (
                      <span class='material-icons'>arrow_drop_down</span>
                    )
                  ) : null}
                </div>{" "}
              </TableHeadCellStyle>
              <TableHeadCellStyle align='center'>
                <div>Edit</div>
              </TableHeadCellStyle>
              <TableHeadCellStyle align='center'>
                <div>Delete</div>
              </TableHeadCellStyle>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderBy(onscreenmembers, columnToSort, sortDirection)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((obj) => (
                <TableRow key={obj._id}>
                  <TableCell component='th' scope='row' align='left'>
                    {obj._id}
                  </TableCell>
                  <TableCell align='left'>{obj.name}</TableCell>
                  <TableCell align='left'>{obj.email}</TableCell>
                  <TableCell align='left'>
                    {/* <Moment format='MMMM do YYYY, h:mm:ss a'>{new Date(created)}</Moment> */}
                    {obj.create_date}
                  </TableCell>
                  <TableCell align='center'>
                    <div
                      style={editButtonStyle}
                      onClick={onEdit.bind(this, obj)}
                    >
                      <span className='material-icons'>edit</span>
                    </div>
                  </TableCell>
                  <TableCell align='center'>
                    <div
                      style={editButtonStyle}
                      onClick={onDelete.bind(this, obj._id)}
                    >
                      <span className='material-icons'>delete</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Table Pagination Component */}
      <TablePagination
        rowsPerPageOptions={[
          5,
          10,
          25,
          50,
          100,
          { value: onscreenmembers.length, label: "All" },
        ]}
        component='div'
        count={onscreenmembers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        classes={{
          root: classes.root,
          label: classes.label,
        }}
      />
    </Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    background: Color.primaryHex,
    color: "white",
    height: 52,
    padding: "0 30px",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "25ch",
  },
  table: {
    minWidth: 650,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: Color.fore,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 4, 3),
    width: "400px",
  },
}));

const TableHeadCellStyle = withStyles(() => ({
  head: {
    backgroundColor: Color.primaryHex,
    color: Color.fore,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const inputStyle = {
  backgroundColor: "transparent",
  borderStyle: "none",
  borderBottom: "1px solid black",
};

const sortIconStyle = {
  display: "flex",
  alignItems: "center",
};

const editButtonStyle = {
  cursor: "pointer",
};

MembersTable.propTypes = {
  onscreenmembers: PropTypes.object.isRequired,
  returnmessage: PropTypes.string.isRequired,
  setOnScreenMembers: PropTypes.func.isRequired,
  setCurrent: PropTypes.func.isRequired,
  deleteMember: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  onscreenmembers: state.member.onscreenmembers,
  returnmessage: state.member.returnmessage,
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
