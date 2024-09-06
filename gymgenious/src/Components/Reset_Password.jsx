import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/LeftBar.jsx'

export default function CreateClass() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Call the Python backend to send the email
        try{const response = await fetch('http://localhost:5000/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        if (response.ok) {
          alert('Email sent!');
        } else {
          alert('Failed to send email.');
        }
    }catch(error) {
        console.error("Error fetching classes:", error);
      }};

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

