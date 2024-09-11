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
    const [errors, setErrors] = useState('');
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const oobCode = query.get('oobCode');
    const auth = getAuth()
    useEffect(() => {
      if (!oobCode) {
        navigate('/');
      }
    }, [oobCode, navigate]);
    
    const validateForm = () => {
      let errors = [];
      const hasNumber = /[0-9]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasUpperCase = /[A-Z]/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const isValidLength = password.length > 7;
      const samePasswords = password == passwordAgain;

      if (!isValidLength) {
          errors.push('La contraseña debe tener más de 8 caracteres.');
      } 
      if (!hasNumber) {
          errors.push('La contraseña debe contener al menos 1 número.');
      } 
      if (!hasLowerCase) {
          errors.push('La contraseña debe contener al menos 1 letra minúscula.');
      } 
      if (!hasUpperCase) {
          errors.push('La contraseña debe contener al menos 1 letra mayúscula.');
      } 
      if (!hasSpecialChar) {
          errors.push('La contraseña debe contener al menos 1 carácter especial.');
      }
      if (!samePasswords) {
        errors.push('Las contraseñas no coinciden.');
      }

      setErrors(errors);
      return errors.length === 0;
  }
  const handleCloseModal = () => {
    setErrors([]);
  }
    const handleSubmit = async (e) => {
      e.preventDefault();
      if(validateForm()){

        try {
          await confirmPasswordReset(auth, oobCode, password);
          alert('Contraseña restablecida exitosamente.');
          navigate('/login');
        } catch (error) {
          console.error('Error al restablecer la contraseña:', error);
          alert('Error al restablecer la contraseña.');
        }
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
        {errors.length > 0 && (
                <div className="errorsCreateAccountModal" onClick={handleCloseModal}>
                    <div className="errorsCreateAccountContentModal" onClick={handleCloseModal}>
                        <ul>
                            {errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
    </div>
    );
}
