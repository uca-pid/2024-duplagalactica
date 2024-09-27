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
  const [failure, setFailure] = useState(false);

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

  const handleError = () => {
    setFailure(true);
    setOpenCircularProgress(false);
    setTimeout(() => {
      setFailure(false);
      navigate('/');
    }, 3000);
    
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('Token:', token);
    if (token) {
      return () => {handleLogout();}
    } else {
      return () => {handleError();}
    }
  }, []);

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
      { failure ? (
        <div className='alert-container'>
          <div className='alert-content'>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Slide direction="up" in={failure} mountOnEnter unmountOnExit >
                <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="error">
                    You are not logged in!
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
