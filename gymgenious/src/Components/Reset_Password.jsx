import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';

export default function CreateClass() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const goToMainPage = () => {
      navigate('/');
    };
  
    const goToLogin = () => {
      navigate('/login');
    };
  
    const goToCreateClass = () => {
      navigate('/class-creation');
    };
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
            <div className='user-button'>
          <HomeIcon onClick={goToMainPage} style={{height: '80%',width: '80%',color:'white'}}/>
        </div>
        <div className='user-button'>
          <PersonIcon onClick={goToLogin} style={{height: '80%',width: '80%',color:'white'}}/>
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

