import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/LaftBarMaterial.jsx';
import { auth } from '../firebase-config.js';
import {signInWithEmailAndPassword } from 'firebase/auth';

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
      const userCredential= await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
      if (!user.emailVerified) {
        alert("Please verify your email address before logging in.");
        return;
      }
      alert("Successful login!");
      navigate(`/?mail=${username}`);
    } catch (error) {
      console.error("Login error:", error);
      alert("Credentials or server error");
    }
  };

  return (
    <div className='App'>
      <LeftBar value={'profile'}/>
      <div className='login-container'>
        <div className='login-content'>
          <h2 style={{color:'#14213D'}}>Login</h2>
          <form onSubmit={loginUser}>
            <div className="input-container">
              <label htmlFor="username" style={{color:'#14213D'}}>Email:</label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
            <div className="input-container">
              <label htmlFor="password" style={{color:'#14213D'}}>Password:</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <button type="submit" className='button_login'>
              Login
            </button>
          </form>
          <div className='login-options'>
            <button className='login-options-text' onClick={goToResetPassword}>Forgot password?</button>
            <button className='login-options-text' onClick={goToCreateAccount}>Create account</button>     
          </div>
        </div>
      </div>
    </div>
  );
}