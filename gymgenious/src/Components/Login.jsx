import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/NewLeftBar.jsx';
import { auth } from '../firebase-config.js';
import {signInWithEmailAndPassword } from 'firebase/auth';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const goToCreateAccount = () => {
    navigate('/create-account');
  };

  const goToResetPassword = () => {
    navigate('/reset-password');
  };

  const loginUser = async (e) => {
    setOpenCircularProgress(true);
    e.preventDefault(); 
    try {
      const userCredential= await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
      if (!user.emailVerified) {
        setOpenCircularProgress(false);
        setVerifyEmail(true);
        setTimeout(() => {
          setVerifyEmail(false);
      }, 3000);
        return;
      }
      console.log("llegue 1")
      const response = await fetch(`http://127.0.0.1:5000/get_unique_user_by_email?mail=${username}`);
      const data = await response.json();
      setOpenCircularProgress(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate(`/?mail=${username}&type=${data.type}`);
      }, 3000);
    } catch (error) {
      console.error("Login error:", error);
      setOpenCircularProgress(false);
      setFailure(true);
      setTimeout(() => {
        setFailure(false);
      }, 3000);
    }
  };

  return (
    <div className='full-screen-image-1'>
      <LeftBar value={'profile'}/>
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
              <Slide direction="up" in={failure} mountOnEnter unmountOnExit >
                  <Alert style={{fontSize:'100%', fontWeight:'bold'}} icon={<CheckIcon fontSize="inherit" /> } severity="success">
                    Successful login!
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
                  <Alert severity="error" style={{fontSize:'100%', fontWeight:'bold'}}>Credentials or server error</Alert>
                </Slide>
              </Box>
            </div>
        </div>
      ) : (
        null
      )}
       { verifyEmail ? (
        <div className='alert-container'>
          <div className='alert-content'>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                Please verify your email address before logging in.
              </Alert>
            </Box>
          </div>
        </div>
      ) : (
        null
      )}
      <div className='login-container'>
        <div className='login-content'>
          <h2 style={{color:'#5e2404'}}>Login</h2>
          <form onSubmit={loginUser}>
            <div className="input-container">
              <label htmlFor="username" style={{color:'#5e2404'}}>Email:</label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                style={{color:'#283618'}}
              />
            </div>
            <div className="input-container">
              <label htmlFor="password" style={{color:'#5e2404'}}>Password:</label>
              <input 
              color='#283618'
                type="password" 
                id="password" 
                name="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <button type="submit" className='button_login'>
              Login
            </button>
          </form>
          <div className='login-options'>
            <button className='login-options-text' onClick={goToResetPassword}>Forgot password?</button>
            <button className='login-options-text' onClick={goToCreateAccount}>Create account</button>     
          </div>
        </div>
      </div>
    </div>
  );
}