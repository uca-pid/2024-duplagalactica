import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LeftBar from '../real_components/LaftBarMaterial.jsx';
import { getAuth, confirmPasswordReset } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

export default function ChangePassword() {
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const oobCode = query.get('oobCode');
    const auth = getAuth()
    useEffect(() => {
      if (!oobCode) {
        navigate('/');
      }
    }, [oobCode, navigate]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (password !== passwordAgain) {
        setError('Las contraseñas no coinciden.');
        return;
      }
  
      try {
        await confirmPasswordReset(auth, oobCode, password);
        setSuccess('Contraseña restablecida exitosamente.');
        navigate('/login');
      } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        setError('Error al restablecer la contraseña.');
      }
    };
    return (
    <div className='App'>
        <LeftBar value={'profile'}/>
        <div className='new-password-container'>
          <div className='new-password-content'>
            <h2>Nueva contraseña</h2>
            <form onSubmit={handleSubmit}>
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
    </div>
    );
}
