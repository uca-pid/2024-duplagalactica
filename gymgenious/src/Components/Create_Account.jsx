import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/LaftBarMaterial.jsx';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';

export default function CreateAccount() {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [date, setDate] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
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
        if (validateForm()) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const firebaseUser = userCredential.user;
                const newUser = {
                    uid: firebaseUser.uid,
                    Name: name,
                    Lastname: lastName,
                    Mail: email,
                    Birthday: date,
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
                });navigate('/'); 
                alert("Account created successfully!");
            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    alert("An account already exists with this email.");
                } else {
                    console.error("Error creating account:", error);
                    alert("Error creating account");
                }
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleCreateAccount();
    };

    const handleCloseModal = () => {
        setErrors([])
    }

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
            <div className='create-account-container'>
                <div className='create-account-content'>
                    <h2 style={{color:'#14213D'}}>Create account</h2>
                    <form onSubmit={handleSubmit} autoComplete='off'>
                        <div className="input-container">
                            <label htmlFor="name" style={{color:'#14213D'}}>Name:</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="lastName" style={{color:'#14213D'}}>Last name:</label>
                            <input 
                                type="text" 
                                id="lastname" 
                                name="lastname" 
                                value={lastName} 
                                onChange={(e) => setLastName(e.target.value)} 
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="date" style={{color:'#14213D'}}>Birthdate:</label>
                            <input 
                                type="date" 
                                id="date" 
                                name="date" 
                                value={date} 
                                onChange={(e) => setDate(e.target.value)} 
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="email" style={{color:'#14213D'}}>Email:</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="password" style={{color:'#14213D'}}>Password:</label>
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
                        <button type="submit" className='button_create_account'>
                            Create account
                        </button>
                    </form>
                </div>
            </div>
            {errors.length > 0 && (
                <div className="errorsCreateAccountModal" onClick={handleCloseModal}>
                    <div className="errorsCreateAccountContentModal" onClick={handleCloseModal}>
                        <ul>
                            {errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
