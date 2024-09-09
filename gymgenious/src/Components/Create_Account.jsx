import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../firestoreService';
import LeftBar from '../real_components/LaftBarMaterial.js';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default function CreateAccount() {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [date, setDate] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gym, setGym] = useState('');
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    const auth = getAuth();

    const validateForm = () => {
        let errors = [];
        
        if (name === '') {
            errors.push('Por favor ingrese un nombre válido.');
        }

        if (lastName === '') {
            errors.push('Por favor ingrese un apellido válido.');
        }

        const today = new Date();
        const inputDate = new Date(date);
        if (inputDate >= today || date === '') {
            errors.push('Por favor ingrese una fecha de nacimiento válida.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Por favor ingrese un correo electrónico válido.');
        }

        const hasNumber = /[0-9]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isValidLength = password.length > 7;

        if (!isValidLength) {
            errors.push('La contraseña debe tener más de 8 caracteres.');
        } 
        if (!hasNumber) {
            errors.push('La contraseña debe contener al menos 1 número.');
        } 
        if (!hasLowerCase) {
            errors.push('La contraseña debe contener al menos 1 letra minúscula.');
        } 
        if (!hasUpperCase) {
            errors.push('La contraseña debe contener al menos 1 letra mayúscula.');
        } 
        if (!hasSpecialChar) {
            errors.push('La contraseña debe contener al menos 1 carácter especial.');
        }

        if (gym === '') {
            errors.push('Por favor ingrese un gimnasio.');
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
                <h2 style={{color:'#14213D'}}>Crear cuenta</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <label htmlFor="name" style={{color:'#14213D'}}>Nombre:</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="lastName" style={{color:'#14213D'}}>Apellido:</label>
                        <input 
                            type="text" 
                            id="lastname" 
                            name="lastname" 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)} 
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="date" style={{color:'#14213D'}}>Fecha de nacimiento:</label>
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
                        <label htmlFor="password" style={{color:'#14213D'}}>Contraseña:</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="gym" style={{color:'#14213D'}}>Gimnasio:</label>
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
            {errors.length > 0 && (
                <div className="error-messages">
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
