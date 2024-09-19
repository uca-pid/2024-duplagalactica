import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/NewLeftBar.jsx';

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
    const urlParams = new URLSearchParams(window.location.search);
    const userMail = urlParams.get('mail');
    const userType = urlParams.get('type');

    const fetchUserInformation = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/get_unique_user_by_email?mail=${userMail}`);
            if (!response.ok) {
                throw new Error('Error al obtener los datos del usuario: ' + response.statusText);
            }
            const data = await response.json();
            setNameFetch(data.Name);
            setLastNameFetch(data.Lastname);
            setEmailFetch(data.Mail);
            setDateFetch(data.Birthday);
            setUser(data);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const fetchModifyUserInformation = async () => {
        try {
            const updatedUser = {
                ...user,
                Name: name || nameFetch,
                Lastname: lastName || lastNameFetch,
                Birthday: date || dateFetch,
                Mail: email || emailFetch
            };

            const response = await fetch('http://127.0.0.1:5000/update_users_info', {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newUser: updatedUser })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar los datos del usuario: ' + response.statusText);
            }
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleChangeModify = () => {
        setIsDisabled(!isDisabled);
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

    useEffect(() => {
        fetchUserInformation();
    }, [userMail]); 

    return (
        <div className='App'>
            <LeftBar email={userMail} type={userType} value={'profile'}/>
            <div className='create-account-container'>
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
                                onChange={(e) => setEmail(e.target.value)}
                                type={isDisabled ? 'text' : (email ? 'email' : 'text')}
                                placeholder={emailFetch}
                                onFocus={(e) => !isDisabled && (e.target.type = 'email')}
                                onBlur={(e) => !email && (e.target.type = 'text')}
                                disabled={isDisabled}
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
        </div>
    );
}
