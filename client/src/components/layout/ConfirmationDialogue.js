import React, { Fragment } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";

const ConfirmationDialogue = (props) => {
  return (
    <Fragment>
      <Dialog
        open={props.open}
        onClose={props.onConfirmDialogClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {props.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onConfirmDialogClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={props.onConfirm} color='error'>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default ConfirmationDialogue;
