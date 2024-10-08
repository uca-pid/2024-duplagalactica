import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import NewLeftBar from '../real_components/NewLeftBar';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { jwtDecode } from "jwt-decode";
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';

function TopRoutines({ routines }) {
    const [itemNb, setItemNb] = React.useState(20);

    const orderedRoutines = routines.sort((a, b) => b.cant_asignados - a.cant_asignados);
  
    const routineNames = orderedRoutines?.map(routine => routine.name);
    const routineData = orderedRoutines?.map(routine => routine.cant_asignados);
  
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
          <BarChart
            height={500}
            series={[{
              data: routineData.slice(0, itemNb),
            }]}
            xAxis={[{
              scaleType: 'band',
              data: routineNames.slice(0, itemNb),
            }]}
          />
      </Box>
    );
  }

  function TopClasses({classes}) {
    const [itemNb, setItemNb] = React.useState(20);

    const orderedClasses = classes.sort((a, b) => b.BookedUsers.length - a.BookedUsers.length);
    const classesNames = orderedClasses?.map(clase => clase.name);
    const classesData = orderedClasses?.map(clase => clase.BookedUsers.length);

    // const exercisesData = [10,8,5,3,1];
    // const exercisesNames = ['Chest','Legs','Lats','Glutes','Biceps'];
  
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
          <BarChart
            height={500}
            series={[{
              data: classesData.slice(0, itemNb),
            }]}
            xAxis={[{
              scaleType: 'band',
              data: classesNames.slice(0, itemNb),
            }]}
          />
      </Box>
    );
  }

  function ExercisesVsUsers() {
    const [itemNb, setItemNb] = React.useState(20);
    const [user, setUser] = React.useState('agus');
    const usersExercises = [
        {
            user: 'agus',
            exercisesData: [10,8,5,3,1],
            exercisesNames: ['Chest','Legs','Lats','Glutes','Biceps'],
        },
        {
            user: 'juan',
            exercisesData: [5,4,3,2,1],
            exercisesNames: ['ex1','ex2','ex3','ex4','ex5'],
        },
        {
            user: 'pepito',
            exercisesData: [50,25,12,6,3],
            exercisesNames: ['1','2','3','4','5'],
        },
    ]
    const users = usersExercises.map(userObj => userObj.user);

    // const orderedRoutines = routines.sort((a, b) => b.cant_asignados - a.cant_asignados);
  
    // const routineNames = orderedRoutines?.map(routine => routine.name);
    // const routineData = orderedRoutines?.map(routine => routine.cant_asignados);

    // const exercisesData = [10,8,5,3,1];
    // const exercisesNames = ['Chest','Legs','Lats','Glutes','Biceps'];
  
    return (
        <>
        <div className="input-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="input-small-container">
                <label htmlFor="routineAssigned" style={{ color: '#14213D' }}>Routine:</label>
                <select
                    id="user"
                    name="user"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                >
                    {users.map((user) => (
                        <option style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} key={user} value={user}>
                            {user}
                        </option>
                    ))}
                </select>
            </div>
        </div>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
          <BarChart
            height={500}
            series={[{
              data: usersExercises.find(userObj => userObj.user === user).exercisesData.slice(0, itemNb),
            }]}
            xAxis={[{
              scaleType: 'band',
              data: usersExercises.find(userObj => userObj.user === user).exercisesNames.slice(0, itemNb),
            }]}
          />
      </Box>
      </>
    );
  }

function CoachGraphics() {
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('cant_asignados');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userMail,setUserMail] = useState(null)
  const isSmallScreen = useMediaQuery('(max-width:700px)');
  const isSmallScreen250 = useMediaQuery('(max-width:400px)');
  const [routines, setRoutines] = useState([]);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [warningConnection, setWarningConnection] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const navigate = useNavigate();
  const isMobileScreen = useMediaQuery('(min-height:750px)');
  const [maxHeight, setMaxHeight] = useState('600px');
  const [viewExercises, setViewExercises] = useState(false);
  const [type, setType] = useState(null);
  const step = 0;
  const [activeStep, setActiveStep] = React.useState(step);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = ['Top routines', 'Top muscles', 'Users vs. Exercises'];
  const [classes, setClasses] = useState([]);

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
    newSkipped = new Set(newSkipped.values());
    newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
    };

    const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

  const fetchRoutines = async () => {
    setOpenCircularProgress(true);
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            console.error('Token no disponible en localStorage');
            return;
        }

        const response = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_routines`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener las rutinas: ' + response.statusText);
        }
        const routines = await response.json();

        const response2 = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_assigned_routines', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response2.ok) {
            throw new Error('Error al obtener las rutinas asignadas: ' + response2.statusText);
        }
        const assignedRoutines = await response2.json();
        const routinesWithAssignedCount = routines.map((routine) => {
            const assignedForRoutine = assignedRoutines.filter((assigned) => assigned.id === routine.id);
            const totalAssignedUsers = assignedForRoutine.reduce((acc, assigned) => {
                return acc + (assigned.users ? assigned.users.length : 0); 
            }, 0);
            return {
                ...routine,
                cant_asignados: totalAssignedUsers, 
            };
        });

        setRoutines(routinesWithAssignedCount);
        setOpenCircularProgress(false);
    } catch (error) {
        console.error("Error fetching rutinas:", error);
        setOpenCircularProgress(false);
        setWarningConnection(true);
        setTimeout(() => {
            setWarningConnection(false);
        }, 3000);
    }

  };

  const fetchClasses = async () => {
    setOpenCircularProgress(true);
    try {
      const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_classes');
      if (!response.ok) {
        throw new Error('Error al obtener las clases: ' + response.statusText);
      }
      const data = await response.json();
      setOpenCircularProgress(false);
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setOpenCircularProgress(false);
      setWarningConnection(true);
      setTimeout(() => {
        setWarningConnection(false);
      }, 3000);
    }
  };

  const verifyToken = async (token) => {
    setOpenCircularProgress(true);
    try {
        const decodedToken = jwtDecode(token);
        setUserMail(decodedToken.email);
        setOpenCircularProgress(false);
    } catch (error) {
        console.error('Error al verificar el token:', error);
        setOpenCircularProgress(false);
        setErrorToken(true);
        setTimeout(() => {
          setErrorToken(false);
        }, 3000);
        throw error;
    }
  };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
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

    useEffect(() => {
        if (userMail) { 
            fetchRoutines();
            fetchClasses();
        }
    }, [userMail]);

      useEffect(() => {
        if(isSmallScreen) {
          setRowsPerPage(10);
        } else {
          setRowsPerPage(5)
        }
        if(isMobileScreen) {
          setMaxHeight('700px');
        } else {
          setMaxHeight('600px')
        }
      }, [isSmallScreen, isMobileScreen])
    
      const fetchUser = async () => {
        setOpenCircularProgress(true);
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

    return (
      <div className="App">
        {type!='coach' ? (
          <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={true}>
              <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <>
            <NewLeftBar/>
            <div className='stepper-container'>
                    <Box sx={{ width: '100%' }}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        
                        if (isStepSkipped(index)) {
                            stepProps.completed = false;
                        }
                        return (
                            <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                        })}
                    </Stepper>
                    {activeStep === steps.length ? 
                        navigate('/')
                     : (
                        <React.Fragment>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                            >
                            Back
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </Box>
                        </React.Fragment>
                    )}
                    </Box>
                </div>
                <div className="graphics-container">
                    <div className='graphics-content'>
                        {activeStep===0 && (
                            <TopRoutines routines={routines}/>
                        )}
                        {activeStep===1 && ( 
                            <TopClasses classes={classes}/>
                        )}
                        {activeStep===2 && (
                            <ExercisesVsUsers/>
                        )}
                    </div>
                </div>
            {openCircularProgress ? (
              <Backdrop
              sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
              open={openCircularProgress}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            ) : (
              null
            )}
            {warningConnection ? (
              <div className='alert-container'>
                <div className='alert-content'>
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Slide direction="up" in={warningConnection} mountOnEnter unmountOnExit >
                      <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                        Connection Error. Try again later!
                      </Alert>
                    </Slide>
                  </Box>
                </div>
              </div>
            ) : (
              null
            )}
            {errorToken ? (
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

export default CoachGraphics;
