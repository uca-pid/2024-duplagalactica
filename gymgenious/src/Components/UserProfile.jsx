import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/NewLeftBar.jsx';
import {jwtDecode} from "jwt-decode";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';

export default function CreateAccount() {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [date, setDate] = useState('');
    const [email, setEmail] = useState('');

    const [nameFetch, setNameFetch] = useState('');
    const [lastNameFetch, setLastNameFetch] = useState('');
    const [dateFetch, setDateFetch] = useState('');
    const [emailFetch, setEmailFetch] = useState('');

    const navigate = useNavigate();
    const [isDisabled, setIsDisabled] = useState(true);
    const [user, setUser] = useState({});
    const [userMail, setUserMail] = useState('');
    const [errorToken,setErrorToken] = useState(false);
    const [openCircularProgress, setOpenCircularProgress] = useState(false);
    const [warningFetchingUserInformation, setWarningFetchingUserInformation] = useState(false);
    const [warningModifyingData, setWarningModifyingData] = useState(false);

    const fetchUserInformation = async () => {
        setOpenCircularProgress(true);
        try {
            console.log(userMail)
            const response = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_users`, {
                method: 'GET', 
                headers: {
                  'Authorization': localStorage.getItem('authToken')
                }
            })
            if (!response.ok) {
                throw new Error('Error al obtener los datos del usuario: ' + response.statusText);
            }
            const data = await response.json();
            const filteredRows = data.filter((row) => row.Mail === userMail);
            console.log(filteredRows[0]);
            setNameFetch(filteredRows[0].Name);
            setLastNameFetch(filteredRows[0].Lastname);
            setEmailFetch(filteredRows[0].Mail);
            setDateFetch(filteredRows[0].Birthday);
            setUser(filteredRows[0]);
            setOpenCircularProgress(false);
        } catch (error) {
            console.error("Error fetching user:", error);
            setOpenCircularProgress(false);
            setWarningFetchingUserInformation(true);
            setTimeout(() => {
                setWarningFetchingUserInformation(false);
            }, 3000);
        }
    };

    const fetchModifyUserInformation = async () => {
        setOpenCircularProgress(true);
        try {
            const updatedUser = {
                ...user,
                Name: name || nameFetch,
                Lastname: lastName || lastNameFetch,
                Birthday: date || dateFetch,
                Mail: email || emailFetch
            };

            const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/update_users_info', {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('authToken')
                },
                body: JSON.stringify({ newUser: updatedUser })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar los datos del usuario: ' + response.statusText);
            }
            const data = await response.json();
            setOpenCircularProgress(false);
            console.log(data);
        } catch (error) {
            console.error("Error updating user:", error);
            setOpenCircularProgress(false);
            setWarningModifyingData(true);
            setTimeout(() => {
                setWarningModifyingData(false);
            }, 3000);
        }
    };

    const handleChangeModify = () => {
        setIsDisabled(!isDisabled);
        setName('');
        setLastName('');
        setDate('')
    };

    const goToChangePassword = () => {
        navigate('/reset-password');
    };

    const handleSave = (event) => {
        event.preventDefault(); 
        fetchModifyUserInformation();
        setIsDisabled(!isDisabled);
        fetchUserInformation();
    };
    const verifyToken = async (token) => {
        setOpenCircularProgress(true);
        try {
            const decodedToken = jwtDecode(token);
            console.log(decodedToken);
            setUserMail(decodedToken.email);
            setOpenCircularProgress(false);
        } catch (error) {
            console.error('Error al verificar el token:', error);
            setOpenCircularProgress(false);
            setErrorToken(true);
            setTimeout(() => {
              setErrorToken(false);
            }, 3000);
            throw error;
        }
      };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        console.log('Token:', token);
        if (token) {
            verifyToken(token);
        } else {
            navigate('/');
            console.error('No token found');
        }
    }, []);

    useEffect(() => {
        if(userMail){
            fetchUserInformation();
        }
    }, [userMail]);

    return (
        <div className='App'>
            {!userMail ? (
                <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={true}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            ) : (
            <>
                <LeftBar/>
                {openCircularProgress ? (
                    <Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={openCircularProgress}
                    >
                    <CircularProgress color="inherit" />
                    </Backdrop>
                ) : null}
                { errorToken ? (
                    <div className='alert-container'>
                        <div className='alert-content'>
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Slide direction="up" in={errorToken} mountOnEnter unmountOnExit >
                                <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="error">
                                    Invalid Token!
                                </Alert>
                            </Slide>
                            </Box>
                        </div>
                    </div>
                ) : (
                    null
                )}
                { warningFetchingUserInformation ? (
                    <div className='alert-container'>
                        <div className='alert-content'>
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Slide direction="up" in={warningFetchingUserInformation} mountOnEnter unmountOnExit >
                                <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                                    Error fetching user information. Try again!
                                </Alert>
                            </Slide>
                            </Box>
                        </div>
                    </div>
                ) : (
                    null
                )}
                { warningModifyingData ? (
                    <div className='alert-container'>
                        <div className='alert-content'>
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Slide direction="up" in={warningModifyingData} mountOnEnter unmountOnExit >
                                <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                                    Error modifying user information. Try again!
                                </Alert>
                            </Slide>
                            </Box>
                        </div>
                    </div>
                ) : (
                    null
                )}
                <div className='user-profile-container'>
                    <div className='create-account-content'>
                        <h2 style={{ color: '#14213D' }}>Profile</h2>
                        <form autoComplete='off' onSubmit={handleSave}>
                            <div className="input-container">
                                <label htmlFor="name" style={{ color: '#14213D' }}>Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isDisabled}
                                    placeholder={nameFetch}
                                />
                            </div>
                            <div className="input-container">
                                <label htmlFor="lastName" style={{ color: '#14213D' }}>Last name:</label>
                                <input
                                    type="text"
                                    id="lastname"
                                    name="lastname"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    disabled={isDisabled}
                                    placeholder={lastNameFetch}
                                />
                            </div>
                            <div className="input-container">
                                <label htmlFor="date" style={{ color: '#14213D' }}>Birthdate:</label>
                                <input
                                    type={isDisabled ? 'text' : (date ? 'date' : 'text')}
                                    id='date'
                                    name='date'
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    placeholder={dateFetch}
                                    onFocus={(e) => !isDisabled && (e.target.type = 'date')}
                                    onBlur={(e) => !date && (e.target.type = 'text')}
                                    disabled={isDisabled}
                                />
                            </div>
                            <div className="input-container">
                                <label htmlFor="email" style={{ color: '#14213D' }}>Email:</label>
                                <input
                                    id="email"
                                    name="email"
                                    value={email}
                                    type='text'
                                    placeholder={emailFetch}
                                    disabled={true}
                                />
                            </div>
                            {isDisabled ? (
                                <>
                                    <button className='button_create_account' type="button" onClick={handleChangeModify}>
                                        Modify data
                                    </button>
                                    <button className='button_create_account' type="button" onClick={handleChangeModify} style={{ color: 'red' }}>
                                        Delete account
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className='button_create_account' type="button" onClick={goToChangePassword}>
                                        Change password
                                    </button>
                                    <button type="submit" className='button_create_account'>
                                        Save
                                    </button>
                                    <button className='button_create_account' type="button" onClick={handleChangeModify}>
                                        Cancel
                                    </button>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </>
            )}
        </div>
    );
}
