import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import {jwtDecode} from "jwt-decode";
import { Button } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Loader from '../real_components/loader.jsx';


export default function ExerciseCreation() {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const [userMail,setUserMail] = useState(null);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [failureErrors, setFailureErrors] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:700px)');
  const [errorName, setErrorName] = useState(false);
  const [errorDesc, setErrorDesc] = useState(false);
  const [errorImage, setErrorImage] = useState(false);

  const validateForm = () => {
    setErrorName(false);
    setErrorDesc(false);
    setErrorImage(false);
    let errors = [];
    
    if (name === '') {
        errors.push('Please assign a name to the exercise.');
        setErrorName(true);
    }

    if (desc === '') {
      errors.push('Please assign a description to the exercise.');
      setErrorDesc(true);
    }

    if (image === null || image===undefined) {
      errors.push('Please enter an image');
      setErrorImage(true);
    }

    return errors.length===0;
}

  const handleCreateExersice = async () => {
    setOpenCircularProgress(true);
    if(validateForm()){
      try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', desc);
        formData.append('owner', userMail);
        if (image) {
            formData.append('image', image);
        }
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token no disponible en localStorage');
          return;
        }
        const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/create_exersice', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Error al crear ejercicio');
        }
        setOpenCircularProgress(false);
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            window.location.reload()
        }, 3000);
      } catch (error) {
        console.error("Error al crear el ejercicio:", error);
        setOpenCircularProgress(false);
        setFailure(true);
        setTimeout(() => {
            setFailure(false);
        }, 3000);
    }
  } else {
    setOpenCircularProgress(false);
    setFailureErrors(true);
    setTimeout(() => {
        setFailureErrors(false);
        }, 3000);
  }
} 

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateExersice();
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
        verifyToken(token);
    } else {
        console.error('No token found');
    }
  }, []);

  const verifyToken = async (token) => {
    try {
        const decodedToken = jwtDecode(token);
        setUserMail(decodedToken.email);
    } catch (error) {
        console.error('Error al verificar el token:', error);
        throw error;
    }
  };

  return (
    <div className='exercise-creation-container'>
      <button 
        onClick={() => window.location.reload()} 
        className="custom-button-go-back-managing"
      >
        <KeyboardBackspaceIcon sx={{ color: '#F5F5F5' }} />
      </button>
      <div className='exercise-creation-content'>
        <h2 style={{color:'#14213D'}}>Create exercise</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container" style={{display:'flex', justifyContent: 'space-between', marginBottom: '0px'}}>
            <div className="input-small-container">
              <label htmlFor="name" style={{color:'#14213D'}}>Name:</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
              {errorName && (<p style={{color: 'red', margin: '0px'}}>Enter a name</p>)}
            </div>
          </div>
          <div className="input-container" style={{display:'flex', justifyContent: 'space-between', marginBottom: '0px'}}>
              <div className="input-small-container">
                  <label htmlFor="desc" style={{color:'#14213D'}}>Desc:</label>
                  {/* <input 
                  type="text" 
                  id="desc" 
                  name="desc" 
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)} 
                  /> */}
                  <textarea 
                  onChange={(e) => setDesc(e.target.value)}
                  name="desc"
                  id="desc"
                  rows={4}
                  value={desc}
                  maxLength={300}
                  style={{maxHeight: '150px', width: '100%', borderRadius: '8px'}} />
                  {errorDesc && (<p style={{color: 'red', margin: '0px'}}>Enter a description</p>)}
              </div>
          </div>
          <div className="input-container" style={{display:'flex', justifyContent: 'space-between', marginBottom: '0px'}}>
            <div className="input-small-container">
              <label htmlFor="image" style={{ color: '#14213D' }}>Image:</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className='input-image'
                onChange={(e) => setImage(e.target.files[0])                  
                }  
              />
              {errorImage && (<p style={{color: 'red', margin: '0px'}}>Enter an image</p>)}
            </div>
          </div>
          <button type="submit" className='button_login'>
            Create exercise
          </button>
        </form>
      </div>
      {openCircularProgress ? (
        <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={openCircularProgress}
        >
        <Loader></Loader>
        </Backdrop>
      ) : null}
      { success ? (
          <div className='alert-container'>
          <div className='alert-content'>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Slide direction="up" in={success} mountOnEnter unmountOnExit >
                  <Alert style={{fontSize:'100%', fontWeight:'bold'}} icon={<CheckIcon fontSize="inherit" /> } severity="success">
                      Exercise successfully created!
                  </Alert>
              </Slide>
              </Box>
          </div>
          </div>
      ) : (
          null
      )}
      { failure ? (
          <div className='alert-container'>
              <div className='alert-content'>
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Slide direction="up" in={failure} mountOnEnter unmountOnExit >
                      <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                          Error creating exercise. Try again!
                      </Alert>
                  </Slide>
                  </Box>
              </div>
          </div>
      ) : (
          null
      )}
    </div>
  );
}
