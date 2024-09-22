import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/NewLeftBar.jsx';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Slide from '@mui/material/Slide';

export default function CreateAccount() {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [date, setDate] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [typeAccount,setTypeAccount] = useState('')
    const navigate = useNavigate();
    const [openCircularProgress, setOpenCircularProgress] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failureEmailRepeated, setFailureEmailRepeated] = useState(false);
    const [failure, setFailure] = useState(false);
    const [failureErrors, setFailureErrors] = useState(false);
    const auth = getAuth();

    const validateForm = () => {
        let errors = [];
        
        if (name === '') {
            errors.push('Please enter a valid name.');
        }

        if (lastName === '') {
            errors.push('Please enter a valid last name.');
        }

        const today = new Date();
        const inputDate = new Date(date);
        if (inputDate >= today || date === '') {
            errors.push('Please enter a valid birthdate.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Please enter a valid email.');
        }

        const hasNumber = /[0-9]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isValidLength = password.length > 7;

        if (!isValidLength) {
            errors.push('The password must be more than 8 characters.');
        } 
        if (!hasNumber) {
            errors.push('The password must contain at least 1 number.');
        } 
        if (!hasLowerCase) {
            errors.push('The password must contain at least 1 lowercase letter.');
        } 
        if (!hasUpperCase) {
            errors.push('The password must contain at least 1 uppercase letter.');
        } 
        if (!hasSpecialChar) {
            errors.push('The password must contain at least 1 special character.');
        }

        setErrors(errors);
        return errors.length === 0;
    }

    const handleCreateAccount = async () => {
        setOpenCircularProgress(true);
        if(validateForm()){
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const firebaseUser = userCredential.user;
                const newUser = {
                    uid: firebaseUser.uid,
                    Name: name,
                    Lastname: lastName,
                    Mail: email,
                    Birthday: date,
                    type: typeAccount
                };
                await fetch('http://127.0.0.1:5000/create_user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser),
                });
                await sendEmailVerification(firebaseUser, {
                    url: 'http://localhost:3000/redirections?mode=verifyEmail', 
                    handleCodeInApp: true
                });
                setOpenCircularProgress(false);
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    navigate('/'); 
                }, 3000);
            } catch (error) {
                setOpenCircularProgress(false);
                if (error.code === 'auth/email-already-in-use') {
                    setFailureEmailRepeated(true);
                    setTimeout(() => {
                        setFailureEmailRepeated(false);
                        }, 3000);
                } else {
                    console.error("Error creating account:", error);
                    setFailure(true);
                    setTimeout(() => {
                        setFailure(false);
                        }, 3000);
                }
            }
        } else {
            setOpenCircularProgress(false);
            setFailureErrors(true);
            setTimeout(() => {
                setFailureErrors(false);
                }, 3000);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleCreateAccount();
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const [openPasswordRequirements, setOpenPasswordRequirements] = useState(false);
    const handleOpenPasswordRequirements = (event) => {
      setAnchorEl(anchorEl ? null : event.currentTarget);
      setOpenPasswordRequirements(!openPasswordRequirements)
    };
    const id = openPasswordRequirements ? 'simple-popper' : undefined;
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
            { success ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Slide direction="up" in={success} mountOnEnter unmountOnExit >
                                <Alert style={{fontSize:'100%', fontWeight:'bold'}} icon={<CheckIcon fontSize="inherit" /> } severity="success">
                                    Account successfully created!
                                </Alert>
                                <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                                    Please, validate email before login!
                                </Alert>
                            </Slide>
                        </Box>
                    </div>
                </div>
            ) : (
                null
            )}
            { failureErrors ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Slide direction="up" in={failureErrors} mountOnEnter unmountOnExit>
                        <div>
                            <Alert severity="error" style={{ fontSize: '100%', fontWeight: 'bold' }}>
                            Error creating account!
                            </Alert>
                            {errors.length > 0 && errors.map((error, index) => (
                            <Alert key={index} severity="info" style={{ fontSize: '100%', fontWeight: 'bold' }}>
                                <li>{error}</li>
                            </Alert>
                            ))}
                        </div>
                        </Slide>
                    </Box>
                    </div>
                </div>
              
            ) : (
                null
            )}
            { failureEmailRepeated ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Slide direction="up" in={failureEmailRepeated} mountOnEnter unmountOnExit >
                        <Alert severity="error" style={{fontSize:'100%', fontWeight:'bold'}}>An account already exists with this email!</Alert>
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
                        <Alert severity="error" style={{fontSize:'100%', fontWeight:'bold'}}>Error creating account. Try again!</Alert>
                        </Slide>
                    </Box>
                </div>
            </div>
            ) : (
                null
            )}
            <div className='create-account-container'>
                <div className='create-account-content'>
                    <h2 style={{color:'#5e2404'}}>Create account</h2>
                    <form onSubmit={handleSubmit} autoComplete='off'>
                        <div className="input-container">
                            <label htmlFor="name" style={{color:'#5e2404'}}>Name:</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="lastName" style={{color:'#5e2404'}}>Last name:</label>
                            <input 
                                type="text" 
                                id="lastname" 
                                name="lastname" 
                                value={lastName} 
                                onChange={(e) => setLastName(e.target.value)} 
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="date" style={{color:'#5e2404'}}>Birthdate:</label>
                            <input 
                                type="date" 
                                id="date" 
                                name="date" 
                                value={date} 
                                onChange={(e) => setDate(e.target.value)} 
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="email" style={{color:'#5e2404'}}>Email:</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="password" style={{color:'#5e2404'}}>Password:</label>
                            <input
                                onClick={handleOpenPasswordRequirements}
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Popper id={id} open={openPasswordRequirements} anchorEl={anchorEl}>
                                <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} onClick={handleOpenPasswordRequirements}>
                                    <p>The password must contain more than 8 characters.</p>
                                    <p>The password must contain at least 1 number.</p>
                                    <p>The password must contain at least 1 lowercase letter.</p>
                                    <p>The password must contain at least 1 uppercase letter.</p>
                                    <p>The password must contain at least 1 special character.</p>
                                </Box>
                            </Popper>
                        </div>
                        <div className="input-container">
                            <label htmlFor="typeAccount" style={{color:'#5e2404'}}>Type of account:</label>
                            <select
                                type="typeAccount" 
                                id="typeAccount" 
                                name="typeAccount" 
                                value={typeAccount} 
                                onChange={(e) => setTypeAccount(e.target.value)} 
                            >
                                <option value="" >Select</option>
                                <option value="client">client</option>
                                <option value="coach">coach</option>
                            </select>
                        </div>
                        <button type="submit" className='button_create_account'>
                            Create account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
