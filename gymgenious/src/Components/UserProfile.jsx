import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/NewLeftBar.jsx';
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
    const [typeAccount,setTypeAccount] = useState('')
    const navigate = useNavigate();
    const [isDisabled, setIsDisabled] = useState(true);

    const handleChangeModify = () => {
        setIsDisabled(!isDisabled)
    }
    const goToChangePassword = () => {
        navigate('/reset-password')
    }

    return (
        <div className='App'>
            <LeftBar value={'profile'}/>
            <div className='create-account-container'>
                <div className='create-account-content'>
                    <h2 style={{color:'#14213D'}}>Profile</h2>
                    <form autoComplete='off'>
                        <div className="input-container">
                            <label htmlFor="name" style={{color:'#14213D'}}>Name:</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                disabled={isDisabled}
                                placeholder='agustin'
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
                                disabled={isDisabled}
                                placeholder='isoldi'
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="date" style={{color:'#14213D'}}>Birthdate:</label>
                            <input 
                               type={isDisabled ? 'text' : (date ? 'date' : 'text')}
                               id='date'
                               name='date'
                               value={date}
                               onChange={(e) => setDate(e.target.value)}
                               placeholder="26/06/2011"
                               onFocus={(e) => !isDisabled && (e.target.type = 'date')}
                               onBlur={(e) => !date && (e.target.type = 'text')}
                               disabled={isDisabled}
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="email" style={{color:'#14213D'}}>Email:</label>
                            <input 
                                id="email" 
                                name="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                type={isDisabled ? 'text' : (email ? 'email' : 'text')}
                                placeholder="isoldi772@gmail.com"
                                onFocus={(e) => !isDisabled && (e.target.type = 'email')}
                                onBlur={(e) => !email && (e.target.type = 'text')}
                                disabled={isDisabled}
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="password" style={{color:'#14213D'}}>Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={true}
                                placeholder='**********'
                            />
                        </div>
                        {isDisabled ? (
                            null
                        ) : (
                            <button className='button_create_account' onClick={goToChangePassword}>
                                Change password
                            </button>
                        )}
                        {isDisabled ? (
                            null
                        ) : (
                            <button type="submit" className='button_create_account'>
                                Save
                            </button>
                        )}
                    </form>
                    {isDisabled ? (
                        <div>
                            <button className='button_create_account' onClick={handleChangeModify}>
                                Modify data
                            </button>
                            <button className='button_create_account' onClick={handleChangeModify} style={{color:'red'}}>
                                Delete account
                            </button>
                    </div>
                        ) : (
                        <button className='button_create_account' onClick={handleChangeModify}>
                            Cancell
                        </button>
                        )}
                    
                </div>
            </div>
        </div>
    );
}
