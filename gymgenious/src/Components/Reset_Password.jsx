import '../App.css';
import React, { useState } from 'react';
import LeftBar from '../real_components/NewLeftBar.jsx';
import { useNavigate } from 'react-router-dom';
import { getAuth,sendPasswordResetEmail } from 'firebase/auth';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [showNotMatchEmail, setShowNoMatchEmail] = useState(false);
    const navigate = useNavigate();
    const [openCircularProgress, setOpenCircularProgress] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);

    const auth = getAuth();
    const handleSubmit = async (e) => {
        setOpenCircularProgress(true);
        e.preventDefault();
        try {
            const url = new URL('http://localhost:3000/get_unique_user_by_email');
            url.searchParams.append('mail', email); 
            await sendPasswordResetEmail(auth, email, {
                url: 'http://localhost:3000/redirections?mode=resetPassword', 
                handleCodeInApp: true
            });
            setOpenCircularProgress(false);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                navigate('/');
            }, 3000);
        } catch (error) {
            console.error("Error sending email:", error);
            setOpenCircularProgress(false);
            setFailure(true);
            setTimeout(() => {
                setFailure(false);
            }, 3000);

        }
    };

    return (
        <div className='App'>
            <LeftBar value={'profile'}/>
            {openCircularProgress ? (
                <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openCircularProgress}
                >
                <CircularProgress color="inherit" />
                </Backdrop>
            ) : null}
            <div className='reset-password-container'>
                <div className='reset-password-content'>
                    <h2 style={{color:'#14213D'}}>Reset password</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-container">
                            <label htmlFor="email" style={{color:'#14213D'}}>Email:</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required
                            />
                        </div>
                        <button type="submit" className='button_create_account'>
                            Send recovery email
                        </button>
                         { success ? (
                            <div className='alert-container'>
                                <div className='alert-content'>
                                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                                        <Slide direction="up" in={failure} mountOnEnter unmountOnExit >
                                            <Alert style={{fontSize:'100%', fontWeight:'bold'}} icon={<CheckIcon fontSize="inherit" /> } severity="success">
                                                Email sent successfully!
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
                                        <Alert severity="error" style={{fontSize:'100%', fontWeight:'bold'}}>
                                            This account does not exist
                                        </Alert>
                                    </Slide>
                                </Box>
                                </div>
                            </div>
                        ) : (
                            null
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}