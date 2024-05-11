import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import React from "react";

type SucessSnackBar = {
  open: boolean;
  msg: string;
  type: "success" | "error" | "info" | "warning"
};

export const SnackBar = ({ open, msg, type }: SucessSnackBar) => {

  const [openSnack, setOpenSnack] = React.useState<boolean>(open);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  React.useEffect(() => {
    console.log(open)
  }, [open])

  return (
    <Snackbar
      open={openSnack}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity={type} variant="filled" sx={{ width: "100%" }}>
        {msg}
      </Alert>
    </Snackbar>
  );
};
