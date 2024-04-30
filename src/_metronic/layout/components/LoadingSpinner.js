import React, { useState } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function LoadingSpinner() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleClose = () => {
      setOpen(false);
    };

    const handleToggle = () => {
      setOpen(!open);
    };

    const loaderOpen = useSelector((state) => state.auth.loaderOpen, shallowEqual);
  
    return (
      <div>
        <Backdrop className={classes.backdrop} open={loaderOpen}>
          <CircularProgress className='text-primary' />
        </Backdrop>
      </div>
    );
}
