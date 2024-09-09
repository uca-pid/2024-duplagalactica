import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../firestoreService';
import LeftBar from '../real_components/LaftBarMaterial.js';
import {getAuth,createUserWithEmailAndPassword } from 'firebase/auth';

export default function CreateAccount() {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [date, setDate] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fieldError, setFieldError] = useState('');
    const [gym, setGym] = useState('');
    const navigate = useNavigate();
    const auth = getAuth();

    const validateName = () => {
        if (name=='') {
            setFieldError('Por favor ingrese un nombre válido.');
        }
    }

    const validateLastName = () => {
        if (lastName=='') {
            setFieldError('Por favor ingrese un apellido válido.');
        }
    }

    const validateDate = () => {
        const today = new Date();
        const inputDate = new Date(date);
        if (inputDate>=today || date=='') {
            setFieldError('Por favor ingrese una fecha de nacimiento válida.');
        }
    }

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setFieldError('Por favor ingrese un correo electrónico válido.');
        }
    }

    const validatePassword = () => {
        // Verifica si la contraseña cumple con las condiciones
        const hasNumber = /[0-9]/.test(password); // Al menos 1 número
        const hasLowerCase = /[a-z]/.test(password); // Al menos 1 letra minúscula
        const hasUpperCase = /[A-Z]/.test(password); // Al menos 1 letra mayúscula
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Al menos 1 carácter especial
        const isValidLength = password.length > 7; // Más de 8 caracteres
    
        // Mensajes de error personalizados
        if (!isValidLength) {
            setFieldError('La contraseña debe tener más de 8 caracteres.');
        } else if (!hasNumber) {
            setFieldError('La contraseña debe contener al menos 1 número.');
        } else if (!hasLowerCase) {
            setFieldError('La contraseña debe contener al menos 1 letra minúscula.');
        } else if (!hasUpperCase) {
            setFieldError('La contraseña debe contener al menos 1 letra mayúscula.');
        } else if (!hasSpecialChar) {
            setFieldError('La contraseña debe contener al menos 1 carácter especial.');
        }
    };

    const validateGym = () => {
        if (gym=='') {
            setFieldError('Por favor ingrese un gimnasio.');
        }
    }

    const validator = () => {
        setFieldError('');
        validateGym();
        validatePassword();
        validateEmail();
        validateDate();
        validateLastName();
        validateName();
    }

    const handleCreateAccount = async () => {
        validator();
        if (fieldError!=''){
            alert(fieldError);
        } else {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const firebaseUser = userCredential.user;
                const newUser = {
                    uid: firebaseUser.uid,
                    Name: name,
                    Lastname: lastName,
                    Mail: email,
                    Birthday: date,
                    Password: password,
                    Gym: gym,
                };
                await createUser(newUser);
                navigate('/'); 
                alert("¡Cuenta creada exitosamente!");
            } catch (error) {
                console.error("Error al crear la cuenta:", error);
                alert("Error al crear la cuenta");
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        handleCreateAccount();
    };

    return (
        <div className='App'>
            <LeftBar value={'profile'}/>
            <div className='create-account-container'>
                <h2>Crear cuenta</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <label htmlFor="name">Nombre:</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="lastName">Apellido:</label>
                        <input 
                            type="text" 
                            id="lastname" 
                            name="lastname" 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)} 
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="date">Fecha de nacimiento:</label>
                        <input 
                            type="date" 
                            id="date" 
                            name="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="email">Email:</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="password">Contraseña:</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="gym">Gimnasio:</label>
                        <input 
                            type="text" 
                            id="gym" 
                            name="gym" 
                            value={gym} 
                            onChange={(e) => setGym(e.target.value)} 
                        />
                    </div>
                    <button type="submit" className='button_create_account'>
                        Crear cuenta
                    </button>
                </form>
            </div>
        </div>
    );
}
