import '../App.css';
import React, { useState } from 'react';
import LeftBar from '../real_components/LaftBarMaterial.js';
import { useNavigate } from 'react-router-dom';
import { getAuth,sendPasswordResetEmail } from 'firebase/auth';
import { getUniqueUserByEmail } from '../firestoreService'; 

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [showNotMatchEmail, setShowNoMatchEmail] = useState(false)
    const navigate = useNavigate();

    const auth = getAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await getUniqueUserByEmail(email); 
            await sendPasswordResetEmail(auth, email); 
            alert('¡Correo electrónico enviado con éxito!');
            navigate('/'); 
        } catch (error) {
            setShowNoMatchEmail(true)
            console.error("Error al enviar el correo electrónico:", error);
        }
    };



    return (
        <div className='App'>
            <LeftBar value={'profile'}/>
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
                    {showNotMatchEmail ? (
                        <div>No existe el correo electronico</div>
                    ):(
                        <div></div>
                    )}
                </form>
            </div>
        </div>
    );
}