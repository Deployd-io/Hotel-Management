import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
const logger = console;
import { hideSnakbar } from "../store/slices/snakbar";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackbarComponent = () => {
logger.error('>>> Entering SnackbarComponent()', { "event.action": "SnackbarComponent" });
  const snackbarState = useSelector((state) => state.snakbar);
  const dispatch = useDispatch();
logger.error(`Alert(elevation=${elevation}): snackbarState.id → ${snackbarState?.id}`, { "event.action": "Alert", "logrite.elevation": elevation });

logger.error(`SnackbarComponent(): snackbarState.id → ${snackbarState?.id}`, { "event.action": "SnackbarComponent" });
  const handleClose = (event, reason) => {
	logger.error(`>>> Entering handleClose(event=${event},reason=${reason})`, { "event.action": "handleClose", "logrite.event": event, "logrite.reason": reason });
    if (reason === "clickaway") {
      return;
    }

    dispatch(hideSnakbar());
	logger.error(`<<< Exiting handleClose(event=${event},reason=${reason})`, { "event.action": "handleClose", "logrite.event": event, "logrite.reason": reason });
  };
  
  return (
    <Snackbar
      open={snackbarState.open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity={snackbarState.type}>
        {snackbarState.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
