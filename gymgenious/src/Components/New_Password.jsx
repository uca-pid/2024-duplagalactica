import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LeftBar from '../real_components/NewLeftBar.jsx';
import { getAuth, confirmPasswordReset } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';

export default function ChangePassword() {
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const navigate = useNavigate();
    const [errors, setErrors] = useState('');
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const oobCode = query.get('code');
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

    const [anchorEl, setAnchorEl] = useState(null);
    const [openPasswordRequirements, setOpenPasswordRequirements] = useState(false);
    const handleOpenPasswordRequirements = (event) => {
      setAnchorEl(anchorEl ? null : event.currentTarget);
      setOpenPasswordRequirements(!openPasswordRequirements)
    };    
    const id = openPasswordRequirements ? 'simple-popper' : undefined;

    const [anchorEl2, setAnchorEl2] = useState(null);
    const [openPasswordRequirements2, setOpenPasswordRequirements2] = useState(false);
    const handleOpenPasswordRequirements2 = (event) => {
      setAnchorEl2(anchorEl2 ? null : event.currentTarget);
      setOpenPasswordRequirements2(!openPasswordRequirements2)
    };    
    const id2 = openPasswordRequirements2 ? 'simple-popper' : undefined;

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
                      onClick={handleOpenPasswordRequirements}
                      type="password" 
                      id="password" 
                      name="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                  />
                  <Popper id={id} open={openPasswordRequirements} anchorEl={anchorEl}>
                    <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} onClick={handleOpenPasswordRequirements}>
                        <p>The password must contain more than 8 characters.</p>
                        <p>The password must contain at least 1 number.</p>
                        <p>The password must contain at least 1 lowercase letter.</p>
                        <p>The password must contain at least 1 uppercase letter.</p>
                        <p>The password must contain at least 1 special character.</p>
                    </Box>
                </Popper>
              </div>
              <div className="input-container">
                  <label htmlFor="password">Confirm password:</label>
                  <input
                      onClick={handleOpenPasswordRequirements2}
                      type="password" 
                      id="password" 
                      name="password" 
                      value={passwordAgain} 
                      onChange={(e) => setPasswordAgain(e.target.value)} 
                  />
              </div>
              <Popper id={id2} open={openPasswordRequirements2} anchorEl={anchorEl2}>
                    <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} onClick={handleOpenPasswordRequirements2}>
                        <p>Passwords must be the same</p>
                    </Box>
                </Popper>
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
