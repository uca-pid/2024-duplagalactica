import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import {jwtDecode} from "jwt-decode";

export default function ExerciseCreation() {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const navigate = useNavigate();
  const [userMail,setUserMail] = useState(null);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [errors, setErrors] = useState([]);
  const [failureErrors, setFailureErrors] = useState(false);
  const [series, setSeries] = useState(4);
  const [reps, setReps] = useState(Array(series).fill(''));
  const [timing, setTiming] = useState(0);

  const handleSeriesChange = (e) => {
    const newSeries = parseInt(e.target.value);
    if(newSeries>=0 && newSeries<=8) {
      setSeries(newSeries);
      setReps(Array(newSeries).fill(''));
    }
  };

  const handleRepsChange = (index, value) => {
    const newReps = [...reps];
    newReps[index] = value;
    setReps(newReps);
  };

  const validateForm = () => {
    let errors = [];
    
    if (name === '') {
        errors.push('Please assign a name to the exercise.');
    }

    if (desc === '') {
      errors.push('Please assign a description to the exercise.');
    }

    setErrors(errors);
    return errors.length===0;
}

  const handleCreateExersice = async () => {
    setOpenCircularProgress(true);
    if(validateForm()){
      try {  
        const newExersice = {
          name: name,
          description: desc,
          owner: userMail,
          reps: reps,
          series: series,
          timing: timing,
        };
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token no disponible en localStorage');
          return;
        }
        const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/create_exersice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(newExersice),
        });

        if (!response.ok) {
          throw new Error('Error al crear ejercicio');
        }
        setOpenCircularProgress(false);
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
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
    console.log('Token:', token);
    if (token) {
        verifyToken(token);
    } else {
        console.error('No token found');
    }
  }, [userMail]);

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
      <div className='class-creation-content'>
        <h2 style={{color:'#14213D'}}>Create exercise</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
            <div className="input-small-container">
              <label htmlFor="name" style={{color:'#14213D'}}>Name:</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
          </div>
          <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
              <div className="input-small-container">
                  <label htmlFor="desc" style={{color:'#14213D'}}>Desc:</label>
                  <input 
                  type="text" 
                  id="desc" 
                  name="desc" 
                  value={desc} 
                  onChange={(e) => setDesc(e.target.value)} 
                  />
              </div>
          </div>
          <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
              <div className="input-small-container">
                  <label htmlFor="desc" style={{color:'#14213D'}}>Series:</label>
                  <input 
                  type="number" 
                  id="series" 
                  name="series" 
                  value={series}
                  min="1"
                  step='1'
                  max="8"
                  onChange={handleSeriesChange}
                  />
              </div>
              <div className="input-small-container">
                  <label htmlFor="timing" style={{color:'#14213D'}}>Timing:</label>
                  <input 
                  type="number" 
                  id="timing" 
                  name="timing" 
                  value={timing}
                  min="1"
                  max="500"
                  step='1'
                  onChange={(e) => setTiming(e.target.value)}
                  />
              </div>
          </div>
          <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
            <div className="input-small-container" style={{ flex: 1, marginRight: '10px' }}>
                <label htmlFor='reps' style={{ color: '#14213D' }}>Reps:</label>
                {reps.map((rep, index) => (
                  <input
                    type="text"
                    id={`reps-${index}`}
                    name={`reps-${index}`}
                    value={rep}
                    onChange={(e) => handleRepsChange(index, e.target.value)}
                    style={{ width: `${100 / series}%` }}
                  />
              ))}
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
        <CircularProgress color="inherit" />
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
      { failureErrors ? (
          <div className='alert-container'>
              <div className='alert-content'>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Slide direction="up" in={failureErrors} mountOnEnter unmountOnExit>
                  <div>
                      <Alert severity="error" style={{ fontSize: '100%', fontWeight: 'bold' }}>
                      Error creating exercise!
                      </Alert>
                      {errors.length > 0 && errors.map((error, index) => (
                      <Alert key={index} severity="info" style={{ fontSize: '100%', fontWeight: 'bold' }}>
                          <li>{error}</li>
                      </Alert>
                      ))}
                  </div>
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
