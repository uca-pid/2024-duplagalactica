import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../firestoreService'; 

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const goToCreateAccount = () => {
    navigate('/create-account');
  };

  const goToResetPassword = () => {
    navigate('/reset-password');
  };

  const loginUser = async (e) => {
    e.preventDefault(); 
    try {
      const user = await getUser(password, username);
      if (user) {
        alert("¡Login exitoso!");
      } else {
        alert("Error en las credenciales");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      alert("Error en el servidor");
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
      <div className='login-container'>
        <h2>Login</h2>
        <form onSubmit={loginUser}>
          <div className="input-container">
            <label htmlFor="username">Email:</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">Password:</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <button type="submit" className='button_login'>
            Ingresar
          </button>
        </form>
        <div className='login-options-reset' onClick={goToResetPassword}>Reset Password</div>
        <div className='login-options-create' onClick={goToCreateAccount}>Create Account</div>
      </div>
    </div>
  );
}