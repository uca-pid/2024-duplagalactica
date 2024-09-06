import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/LeftBar.jsx'

export default function CreateClass() {
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const navigate = useNavigate();

    return (
    <div className='App'>
        <LeftBar/>
        <div className='login-container'>
            <h2>Nueva contraseña</h2>
            <form >
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
                    <label htmlFor="password">Confirmar contraseña:</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={passwordAgain} 
                        onChange={(e) => setPasswordAgain(e.target.value)} 
                    />
                </div>
                <button type="submit" className='button_create_account'>
                    Confirmar nueva contraseña
                </button>
            </form>
        </div>
    </div>
    );
}

