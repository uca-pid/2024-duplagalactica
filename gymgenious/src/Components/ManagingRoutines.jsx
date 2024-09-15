import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/LaftBarMaterial.jsx';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import ExerciseCreation from './ExerciseCreation.jsx'
import RoutineCreation from './RoutineCreation.jsx'
import AssignRoutineToUser from './AssignRoutineToUser.jsx'

export default function ManagingRoutines () {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [routine, setRoutine] = useState('');
  const [users, setUsers] = useState('');
  const navigate = useNavigate();

  const steps = ['Create exercise', 'Create routine', 'Assign routine'];

//   const handleCreateClass = async () => {
//     try {  
//       const newClass = {
//         name: name,
//         dateInicio: isoDateStringInicio,
//         dateFin: isoDateStringFin,
//         hour: hour,
//         day: day(date),
//         permanent: permanent,
//       };

//       const response = await fetch('http://127.0.0.1:5000/create_class', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newClass),
//       });

//       if (!response.ok) {
//         throw new Error('Error al crear la clase');
//       }

//       navigate('/', { state: { message: 'block' } });
//       alert("¡Clase creada exitosamente!");
//     } catch (error) {
//       console.error("Error al crear la clase:", error);
//   };


    const handleSubmit = (e) => {
        e.preventDefault();
        //handleCreateClass();
    };

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
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
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

  return (
    <div className='App'>
        <LeftBar value={'add'}/>
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
                <Typography sx={{ mt: 2, mb: 1 }}>
                    All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleReset}>Reset</Button>
                </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
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
                    <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
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
    </div>
  );
}
