import '../App.css';
import React, { useState,useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/NewLeftBar.jsx';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ExerciseCreation from './ExerciseCreation.jsx'
import RoutineCreation from './RoutineCreation.jsx'
import AssignRoutineToUser from './AssignRoutineToUser.jsx'
import {jwtDecode} from "jwt-decode";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

export default function ManagingRoutines () {
  const [userMail,setUserMail] = useState('')
  const step = 0;
  const [activeStep, setActiveStep] = React.useState(step);
  const [skipped, setSkipped] = React.useState(new Set());
  const [errorToken,setErrorToken] = useState(false);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const steps = ['Create exercise', 'Create routine', 'Assign routine'];
  const navigate = useNavigate();
  const [type, setType] = useState(null);

    const isStepOptional = () => {
        return true;
    };

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

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
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
    if (userMail){
      fetchUser();
    }
  }, [userMail]);

  const fetchUser = async () => {
    try {
      const encodedUserMail = encodeURIComponent(userMail);
      const response = await fetch(`http://127.0.0.1:8000/get_unique_user_by_email?mail=${encodedUserMail}`);
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
    <div className='full-screen-image-3'>
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
                <div className='stepper-container'>
                    <Box sx={{ width: '100%' }}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        
                        if (isStepOptional(index)) {
                            labelProps.optional = (
                            <Typography variant="caption">Optional</Typography>
                            );
                        }
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
                    {activeStep === steps.length ? (
                        <React.Fragment>
                        <Typography>
                            All steps completed - you&apos;re finished
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleReset}>Reset</Button>
                        </Box>
                        </React.Fragment>
                    ) : (
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
                            {isStepOptional(activeStep) && (
                            <Button color="inherit" onClick={handleSkip}>
                                Skip
                            </Button>
                            )}
                            <Button onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </Box>
                        </React.Fragment>
                    )}
                    </Box>
                </div>
                {activeStep===0 && (
                    <ExerciseCreation/>
                )}
                {activeStep===1 && (
                    <RoutineCreation/>
                )}
                {activeStep===2 && (
                    <AssignRoutineToUser/>
                )}
                {openCircularProgress ? (
                    <Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={openCircularProgress}
                    >
                    <CircularProgress color="inherit" />
                    </Backdrop>
                ) : null}
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
