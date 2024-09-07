import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/LeftBar.jsx'

export default function CreateClass() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

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
        <div className='Left-Bar'>
            <div className='Logo-Container'>
                <svg className='Container-Logo' viewBox="0 0 220 210">
                    <defs>
                        <path id="circlePath" d="M 110,100 m -90,0 a 90,90 0 1,1 180,0 a 90,90 0 1,1 -180,0" />
                    </defs>
                    <circle cx="100" cy="100" r="90" fill="#14213D" />
                    <image href="/LogoGymGenius.png" x="10" y="10" height="180" width="180" />
                    <text>
                        <textPath href="#circlePath" className="Circle-Text">
                            GymGenius GymGenius GymGenius GymGenius GymGenius GymGenius GymGenius GymGenius
                        </textPath>
                    </text>
                </svg>
            </div>
        </div>
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

