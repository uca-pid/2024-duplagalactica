// src/ResetPassword.js
import '../App.css';
import React, { useState } from 'react';
import { sendEmail } from '../firestoreService'; 
import LeftBar from '../real_components/LeftBar.jsx';

export default function ResetPassword() {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await sendEmail(email); 

            if (result) {
                alert('¡Correo electrónico enviado con éxito!');
            } else {
                alert('No se pudo enviar el correo electrónico.');
            }
        } catch (error) {
            console.error("Error al enviar el correo electrónico:", error);
            alert('Error en el servidor.');
        }
    };

    return (
        <div className='App'>
            <LeftBar/>
            <div className='reset-password-container'>
                <h2>Recuperar cuenta</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <label htmlFor="email">Email:</label>
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
                        Enviar mail de recuperación
                    </button>
                </form>
            </div>
        </div>
    );
}
