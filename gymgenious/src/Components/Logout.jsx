import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';

const Logout = () => {
  const navigate = useNavigate();
  const [openCircularProgress, setOpenCircularProgress] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleLogout = () => {
      localStorage.removeItem('authToken');
      setTimeout(() => {
        setOpenCircularProgress(false);
        setSuccess(true);
      }, 1000);
      setTimeout(() => {
        setSuccess(false)
        navigate('/'); 
      }, 3000); 
    };

    handleLogout();
  }, [navigate]);

  return (
    <div className='App'>
      {openCircularProgress ? (
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={openCircularProgress}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}
      { success ? (
        <div className='alert-container'>
          <div className='alert-content'>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Slide direction="up" in={success} mountOnEnter unmountOnExit >
                  <Alert style={{fontSize:'100%', fontWeight:'bold'}} icon={<CheckIcon fontSize="inherit" /> } severity="success">
                    Successful logout!
                  </Alert>
              </Slide>
            </Box>
          </div>
        </div>
      ) : (
        null
      )}
    </div>
  );
};

export default Logout;
