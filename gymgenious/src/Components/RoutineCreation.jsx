import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import ExcersiceAssignment from './ExcersiceAssignment.jsx';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import {jwtDecode} from "jwt-decode";
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

export default function RoutineCreation() {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [userMail,setUserMail] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [routineExercises, setRoutineExercises] = useState([]);
    const navigate = useNavigate();
    const [openCircularProgress, setOpenCircularProgress] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);
    const [errors, setErrors] = useState([]);
    const [failureErrors, setFailureErrors] = useState(false);
    const [warningFetchingExercises, setWarningFetchingExercises] = useState(false);

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

    const handleAddExercise = (exercise) => {
      let exerciseWithParams = {
        id: exercise.id,
        description: exercise.description,
        name: exercise.name,
        owner: exercise.owner,
        reps: reps,
        series: series,
        timing: timing,
      }
      console.log("agregado",exerciseWithParams)
      setRoutineExercises([...routineExercises, exerciseWithParams]);
      handleCloseModal();
    };

    const handleSelectExercise = (event) => {
      setSelectedExercise(event);
    };
  
    const handleCloseModal = () => {
      setSelectedExercise(null);
    };

    const customList = (items) => (
      <div className='transfer-list'>
        <List dense component="div" role="list">
          {items.map((exercise) => {
            const labelId = `transfer-list-item-${exercise.name}-label`;
            return (
              <>
              { (routineExercises?.some(stateExercise => stateExercise.id === exercise.id)) ? (
                <ListItemButton
                sx={{backgroundColor:'red'}}
                key={exercise.id}
                role="listitem"
                onClick={() => handleSelectExercise(exercise)}
              >
                <ListItemText id={labelId}><p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{exercise.name}</p></ListItemText>
              </ListItemButton>
              ) : (
                <ListItemButton
                key={exercise.id}
                role="listitem"
                onClick={() => handleSelectExercise(exercise)}
              >
                <ListItemText id={labelId}><p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{exercise.name}</p></ListItemText>
              </ListItemButton>
              )}
              </>
            );
          })}
        </List>
      </div>
    );

    const correctExercisesData = async (exercisesData) => {
      let autoIncrementId=0;
      return exercisesData.map(element => {
          if (!element.series) {
              autoIncrementId++;
              return {
                  id: element.id || autoIncrementId,
                  name: element.name,
                  series: 4,
                  reps: [12, 12, 10, 10],
                  timing: '60',
                  description: 'aaaa',
                  owner: 'Train-Mate'
              };
          }
          return element;
      });
  };
  
    const fetchExercises = async () => {
      setOpenCircularProgress(true);
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token no disponible en localStorage');
          return;
        }
        const response = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_excersices`, {
          method: 'GET', 
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
      });
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios: ' + response.statusText);
      }
      const exercisesData = await response.json();
  
        const response2 = await fetch(`https://train-mate-api.onrender.com/api/exercise/get-all-exercises`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${authToken}`
          }
        });
        const exercisesDataFromTrainMate = await response2.json();
        const totalExercises = exercisesData.concat(exercisesDataFromTrainMate.exercises)
        const totalExercisesCorrected = await correctExercisesData(totalExercises);
        setExercises(totalExercisesCorrected);
        setOpenCircularProgress(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setOpenCircularProgress(false);
        setWarningFetchingExercises(true);
        setTimeout(() => {
          setWarningFetchingExercises(false);
        }, 3000);
      }
    };

    const validateForm = () => {
      let errors = [];
      
      if (name === '') {
          errors.push('Please assign a name to the routine.');
      }

      if (desc === '') {
        errors.push('Please assign a description to the routine.');
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
          excercises: routineExercises,
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
    if (token) {
        verifyToken(token);
    } else {
        console.error('No token found');
    }
  }, []);
  
  useEffect(() => {
    if (userMail) {
      fetchExercises();
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
          {/* <div className="grid-create-routine-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
              <div className="input-small-create-routine-container">
                  <label htmlFor="users" style={{ color: '#14213D' }}>Exercises:</label>
                  <ExcersiceAssignment onUsersChange={handleExcersiceChange} owner={userMail}/>
              </div>
          </div> */}
          <div className="'grid-transfer-container" style={{display:'flex', justifyContent: 'space-between'}}>
            <div className="input-small-container">
                <label htmlFor="users" style={{ color: '#14213D' }}>Exercises:</label>
                <Grid className='grid-transfer-content' item>{customList(exercises)}</Grid>
            </div>
          </div>
          <button type="submit" className='button_login'>
            Create routine
          </button>
        </form>
      </div>
      {selectedExercise && (
        <div className="Modal" onClick={handleCloseModal}>
          <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
          <h2 style={{marginBottom: '0px'}}>Exercise</h2>
                                <p style={{
                                    marginTop: '5px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '100%',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    {selectedExercise.name}
                                </p>
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
            <button onClick={() => handleAddExercise(selectedExercise)}>Add exercise</button>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
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
