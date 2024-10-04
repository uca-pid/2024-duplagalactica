import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/NewLeftBar.jsx';
import moment from 'moment'
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Slide from '@mui/material/Slide';
import Popper from '@mui/material/Popper';
import {jwtDecode} from "jwt-decode";
import { useMediaQuery } from '@mui/material';

export default function CreateClass() {
  const [hour, setHour] = useState('');
  const [hourFin, setHourFin] = useState('');
  const [permanent, setPermanent] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [maxNum,setMaxNum] = useState(1);
  const navigate = useNavigate();
  const [userMail,setUserMail] = useState('')
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [failureErrors, setFailureErrors] = useState(false);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const [type, setType] = useState(null);

  const day = (dateString) => {
    const date = new Date(dateString);
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return daysOfWeek[date.getDay()];
  };

  const validateForm = () => {
      let errors = [];
      const format= "HH:mm";
      const realHourEnd = moment(hourFin, format).subtract(30, 'minutes').format(format);
      if(moment(realHourEnd, format).isBefore(moment(hour, format))){
        errors.push('Class must last at least 30 minutes.');
      }

      if(hour==='' || hourFin===''){
        errors.push('Please enter both the start and end times.')
      }

      if (name === '') {
          errors.push('Please enter an exercise name.');
      }

      if(permanent===''){
        errors.push('Please enter if the class is recurring or not.');
      }

      if(date===''){
        errors.push('Please enter a date.')
      }

      setErrors(errors);
      return errors.length === 0;
  }

  const handleCreateClass = async () => {
    setOpenCircularProgress(true);
    if(validateForm()){
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token no disponible en localStorage');
          return;
        }
        const isoDateStringInicio = `${date}T${hour}:00Z`;
        const isoDateStringFin = `${date}T${hourFin}:00Z`;
        const newClass = {
          name: name,
          dateInicio: isoDateStringInicio,
          dateFin: isoDateStringFin,
          hour: hour,
          day: day(date),
          permanent: permanent,
          owner: userMail,
          capacity: maxNum,
          BookedUsers: []
        };
        const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/create_class', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(newClass),
        });
    
        if (!response.ok) {
          throw new Error('Error al crear la clase');
        }
        setOpenCircularProgress(false);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigate(`/?mail=${userMail}`, { state: { message: 'block' } });
        }, 3000);
      } catch (error) {
        console.error("Error al crear la clase:", error);
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
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateClass();
  };

  const verifyToken = async (token) => {
    try {
        const decodedToken = jwtDecode(token);
        setUserMail(decodedToken.email);
    } catch (error) {
        console.error('Error al verificar el token:', error);
        setErrorToken(true);
        setTimeout(() => {
          setErrorToken(false);
        }, 3000);
        throw error;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('Token:', token);
    if (token) {
        verifyToken(token);
    } else {
        navigate('/');
        console.error('No token found');
    }
  }, []);

  useEffect(() => {
    if (userMail) {
      fetchUser();
    }
  }, [userMail]);

  const fetchUser = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const encodedUserMail = encodeURIComponent(userMail);
      const response = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_unique_user_by_email?mail=${encodedUserMail}`, {
            method: 'GET', 
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario: ' + response.statusText);
        }
        const data = await response.json();
        setType(data.type);
        if(data.type!='coach'){
          navigate('/');
        }
    } catch (error) {
        console.error("Error fetching user:", error);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [openHourRequirements, setOpenHourRequirements] = useState(false);
  const handleOpenHourRequirements = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenHourRequirements(!openHourRequirements)
  };
  const id = 'simple-popper';

  const handleCloseHourRequirements = () => {
    setOpenHourRequirements(false);
  }

  return (
    <div className='full-screen-image-2'>
      {type!='coach' ? (
            <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        ) : (
          <>
            <LeftBar/>
            <div className='class-creation-container'>
              <div className='class-creation-content'>
                <h2 style={{color:'#5e2404'}}>Create class</h2>
                <form onSubmit={handleSubmit}>
                  {!isSmallScreen ? (
                    <>
                      <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                        <div className="input-small-container">
                          <label htmlFor="hour" style={{color:'#5e2404'}}>Start time:</label>
                          <input
                            onClick={handleCloseHourRequirements}
                            type="time" 
                            id="hour" 
                            name="hour" 
                            value={hour} 
                            onChange={(e) => setHour(e.target.value)} 
                          />
                        </div>
                        <div className="input-small-container">
                          <label htmlFor="hour" style={{color:'#5e2404'}}>End time:</label>
                          <input
                            onClick={handleOpenHourRequirements}
                            type="time" 
                            id="hourFin" 
                            name="hourFin" 
                            value={hourFin} 
                            onChange={(e) => setHourFin(e.target.value)} 
                          />
                          <Popper id={id} open={openHourRequirements} anchorEl={anchorEl}>
                            <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} onClick={handleOpenHourRequirements}>
                                <p>Class must last at least 30 minutes</p>
                            </Box>
                          </Popper>
                        </div>
                        <div className="input-small-container">
                          <label htmlFor="name" style={{color:'#5e2404'}}>Name:</label>
                          <input
                            onClick={handleCloseHourRequirements}
                            type="text" 
                            id="name" 
                            name="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                          />
                        </div>
                      </div>
                      <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                        <div className="input-small-container" style={{width:"100%"}}>
                          <label htmlFor="permanent" style={{color:'#5e2404'}}>Recurrent:</label>
                          <select
                            onClick={handleCloseHourRequirements}
                            id="permanent" 
                            name="permanent" 
                            value={permanent} 
                            onChange={(e) => setPermanent(e.target.value)} 
                          >
                            <option value="" >Select</option>
                            <option value="Si">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                        <div className="input-small-container" style={{ flex: 3, textAlign: 'left' }}>
                          <label htmlFor="maxNum" style={{color:'#5e2404'}}>Participants:</label>
                          <input
                            onClick={handleCloseHourRequirements}
                            type="number" 
                            id="maxNum" 
                            name="maxNum"
                            min='1'
                            max='500'
                            step='1'
                            value={maxNum} 
                            onChange={(e) => setMaxNum(e.target.value)} 
                          />
                        </div>
                        <div className="input-small-container" style={{ flex: 3, textAlign: 'left' }}>
                          <label htmlFor="date" style={{color:'#5e2404'}}>Date:</label>
                          <input
                            onClick={handleCloseHourRequirements}
                            type="date" 
                            id="date" 
                            name="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                        <div className="input-small-container">
                          <label htmlFor="hour" style={{color:'#5e2404'}}>Start time:</label>
                          <input
                            onClick={handleCloseHourRequirements}
                            type="time" 
                            id="hour" 
                            name="hour" 
                            value={hour} 
                            onChange={(e) => setHour(e.target.value)} 
                          />
                        </div>
                        <div className="input-small-container">
                          <label htmlFor="hour" style={{color:'#5e2404'}}>End time:</label>
                          <input
                            onClick={handleOpenHourRequirements}
                            type="time" 
                            id="hourFin" 
                            name="hourFin" 
                            value={hourFin} 
                            onChange={(e) => setHourFin(e.target.value)} 
                          />
                          <Popper id={id} open={openHourRequirements} anchorEl={anchorEl}>
                            <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} onClick={handleOpenHourRequirements}>
                                <p>Class must last at least 30 minutes</p>
                            </Box>
                          </Popper>
                        </div>
                      </div>
                      <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                        <div className="input-small-container">
                            <label htmlFor="name" style={{color:'#5e2404'}}>Name:</label>
                            <input
                              onClick={handleCloseHourRequirements}
                              type="text" 
                              id="name" 
                              name="name" 
                              value={name} 
                              onChange={(e) => setName(e.target.value)} 
                            />
                          </div>
                        <div className="input-small-container" style={{width:"100%"}}>
                          <label htmlFor="permanent" style={{color:'#5e2404'}}>Recurrent:</label>
                          <select
                            onClick={handleCloseHourRequirements}
                            id="permanent" 
                            name="permanent" 
                            value={permanent} 
                            onChange={(e) => setPermanent(e.target.value)} 
                          >
                            <option value="" >Select</option>
                            <option value="Si">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                      </div>
                      <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                        <div className="input-small-container" style={{ flex: 3, textAlign: 'left' }}>
                          <label htmlFor="maxNum" style={{color:'#5e2404'}}>Participants:</label>
                          <input
                            onClick={handleCloseHourRequirements}
                            type="number" 
                            id="maxNum" 
                            name="maxNum"
                            min='1'
                            max='500'
                            step='1'
                            value={maxNum} 
                            onChange={(e) => setMaxNum(e.target.value)} 
                          />
                        </div>
                        <div className="input-small-container" style={{ flex: 3, textAlign: 'left' }}>
                          <label htmlFor="date" style={{color:'#5e2404'}}>Date:</label>
                          <input
                            onClick={handleCloseHourRequirements}
                            type="date" 
                            id="date" 
                            name="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                          />
                        </div>
                      </div>
                    </>
                  )}
                  
                  <button type="submit" className='button_login'>
                    Create class
                  </button>
                </form>
              </div>
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
                              Class successfully created!
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
                            Error creating class!
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
                        <Alert severity="error" style={{fontSize:'100%', fontWeight:'bold'}}>Error creating class. Try again!</Alert>
                        </Slide>
                    </Box>
                </div>
            </div>
            ) : (
                null
            )}
            { errorToken ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Slide direction="up" in={errorToken} mountOnEnter unmountOnExit >
                            <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="error">
                                Invalid Token!
                            </Alert>
                        </Slide>
                        </Box>
                    </div>
                </div>
            ) : (
                null
            )}
          </>
      )}
    </div>
  );
}
