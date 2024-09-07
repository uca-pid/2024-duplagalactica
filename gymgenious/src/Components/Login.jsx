import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../firestoreService'; 
import LeftBar from '../real_components/LeftBar.jsx';

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
      <LeftBar/>
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