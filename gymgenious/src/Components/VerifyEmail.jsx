import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, checkActionCode,applyActionCode } from 'firebase/auth';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const actionCode = query.get('code');
  const [verification, setVerification] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [openCircularProgress, setOpenCircularProgress] = useState(true);

  useEffect(() => {
    if (!actionCode) {
      navigate('/error');
      return;
    }
    let verified = false;
    const verifyUser = async () => {
      if (verified) return;

      const auth = getAuth();

      try {
        verified=true;
        await checkActionCode(auth, actionCode);
        await applyActionCode(auth, actionCode);
        setVerification(true);
        setTimeout(() => {
          setOpenCircularProgress(false);
          setSuccess(true);
        }, 1500);
        setTimeout(() => {
          setSuccess(false);
          navigate('/');
        }, 3000);
      } catch (error) {
        console.error("Error al verificar el correo electrónico:", error);
        setTimeout(() => {
          setOpenCircularProgress(false);
          setFailure(true);
        }, 2000);
        setTimeout(() => {
          setFailure(false);
          navigate('/login');
        }, 5000);
      }
    };
    
    if (!verification) {
      verifyUser();
    }
  }, [actionCode, navigate, verification]);

  return (
    <div className='full-screen-image-login'>
      {openCircularProgress ? (
        <Backdrop
          sx={(theme) => ({ color: '#fff',
            zIndex: theme.zIndex.drawer + 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          })}
          open={openCircularProgress}
        >
          <h2>Verifying email...</h2>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}
      { success ? (
        <div className='alert-container'>
          <div className='alert-content'>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Slide direction="up" in={success} mountOnEnter unmountOnExit >
                  <Alert style={{fontSize:'100%', fontWeight:'bold'}} icon={<CheckIcon fontSize="inherit" /> } severity="success">
                    Email successfuly verified!
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
                          Error verifying email. Try again!
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
}
