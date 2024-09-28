import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExcersiceAssignment from './ExcersiceAssignment.jsx';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import {jwtDecode} from "jwt-decode";

export default function RoutineCreation() {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [userMail,setUserMail] = useState(null);
    const [exercises, setExercises] = useState('');
    const [day, setDay] = useState('');
    const navigate = useNavigate();
    const [openCircularProgress, setOpenCircularProgress] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);
    const [errors, setErrors] = useState([]);
    const [failureErrors, setFailureErrors] = useState(false);

    const handleExcersiceChange = (newExcersices) => {
      setExercises(newExcersices);
    };

    const validateForm = () => {
      let errors = [];
      
      if (name === '') {
          errors.push('Please assign a name to the routine.');
      }

      if (desc === '') {
        errors.push('Please assign a description to the routine.');
      }

      if (day === '') {
        errors.push('Please select one day to assign the routine.');
      }
      
      if (exercises === '') {
        errors.push('Please select at least one exercise to assign the routine.');
      }

      setErrors(errors);
      return errors.length===0;
  }

  const handleCreateRoutine = async () => {
    setOpenCircularProgress(true);
    if(validateForm()){
      try {  
        const newRoutine = {
          name: name,
          description: desc,
          excercises: exercises,
          day: day,
          owner: userMail,
        };
        
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token no disponible en localStorage');
          return;
        }
        const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/create_routine', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(newRoutine),
        });
  
        if (!response.ok) {
          throw new Error('Error al crear la rutina');
        }
        setOpenCircularProgress(false);
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            navigate(`/`);
        }, 3000);
      } catch (error) {
        console.error("Error al crear la rutina:", error);
        setOpenCircularProgress(false);
        setFailure(true);
        setTimeout(() => {
            setFailure(false);
        }, 3000);
      };
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
    handleCreateRoutine();
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
    <div className='routine-creation-container'>
      <div className='routine-creation-content'>
        <h2 style={{color:'#14213D'}}>Create routine</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-create-routine-container" style={{display:'flex', justifyContent: 'space-between'}}>
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
              <div className="input-small-container">
                  <label htmlFor="day" style={{color:'#14213D'}}>Day:</label>
                  <select
                  id="day" 
                  name="day" 
                  value={day} 
                  onChange={(e) => setDay(e.target.value)} 
                >
                  <option value="" >Select</option>
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
              </div>
          </div>
          <div className="input-create-routine-container" style={{display:'flex', justifyContent: 'space-between'}}>
          <div className="input-small-container">
                  <label htmlFor="desc" style={{color:'#14213D'}}>Description:</label>
                  <input 
                  type="text" 
                  id="desc" 
                  name="desc" 
                  value={desc} 
                  onChange={(e) => setDesc(e.target.value)} 
                  />
              </div>
          </div>
          <div className="grid-create-routine-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
              <div className="input-small-create-routine-container">
                  <label htmlFor="users" style={{ color: '#14213D' }}>Exercises:</label>
                  <ExcersiceAssignment onUsersChange={handleExcersiceChange} owner={userMail}/>
              </div>
          </div>
          <button type="submit" className='button_login'>
            Create routine
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
                          Routine successfully created!
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
                        Error creating routine.
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
                            Error creating routine. Try again!
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
