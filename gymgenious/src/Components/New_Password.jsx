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
        errors.push('The password must be more than 8 characters.');
      } 
      if (!hasNumber) {
          errors.push('The password must contain at least 1 number.');
      } 
      if (!hasLowerCase) {
          errors.push('The password must contain at least 1 lowercase letter.');
      } 
      if (!hasUpperCase) {
          errors.push('The password must contain at least 1 uppercase letter.');
      } 
      if (!hasSpecialChar) {
          errors.push('The password must contain at least 1 special character.');
      }
      if (!samePasswords) {
        errors.push('Passwords must be the same.');
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
          alert('Password reset successfully.');
          navigate('/login');
        } catch (error) {
          console.error('Password reset error:', error);
          alert('Password reset error.');
        }
      }
    };
    return (
    <div className='App'>
        <LeftBar value={'profile'}/>
        <div className='new-password-container'>
          <div className='new-password-content'>
            <h2>Reset password</h2>
            <form onSubmit={handleSubmit}>
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
              <div className="input-container">
                  <label htmlFor="password">Confirm password:</label>
                  <input 
                      type="password" 
                      id="password" 
                      name="password" 
                      value={passwordAgain} 
                      onChange={(e) => setPasswordAgain(e.target.value)} 
                  />
              </div>
              <button type="submit" className='button_create_account'>
                  Confirm new password
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
