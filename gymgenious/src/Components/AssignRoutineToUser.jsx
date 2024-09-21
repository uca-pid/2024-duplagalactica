import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UsserAssignment from './UsersAssignment.jsx';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';

export default function RoutineCreation({ email }) {
    const [routineAssigned, setRoutine] = useState(''); //OJO ACA, LO TENGO QUE DEJAR '', SIN EL ESPACIO NO SE VEN LOS USERS AL PRINCIPIO
    const [users, setUsers] = useState([]);
    const [routines, setRoutines] = useState([]);
    const navigate = useNavigate();
    const [openCircularProgress, setOpenCircularProgress] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);
    const [warningFetchingRoutines, setWarningFetchingRoutines] = useState(false);
    const [errors, setErrors] = useState([]);
    const [failureErrors, setFailureErrors] = useState(false);

    const fetchRoutines = async () => {
        setOpenCircularProgress(true);
        try {
            const response = await fetch(`http://127.0.0.1:5000/get_routines_by_owner?owner=${email}`);
            if (!response.ok) {
                throw new Error('Error al obtener las rutinas: ' + response.statusText);
            }
            const data = await response.json();
            setOpenCircularProgress(false);
            setRoutines(data); 
        } catch (error) {
            console.error("Error fetching rutinas:", error);
            setOpenCircularProgress(false);
            setWarningFetchingRoutines(true);
            setTimeout(() => {
                setWarningFetchingRoutines(false);
            }, 3000);
        }
    };

    useEffect(() => {
        fetchRoutines();
    }, []);

    const validateForm = () => {
        let errors = [];
        
        if (routineAssigned === '') {
            errors.push('Please select a routine to assign');
        }

        //AGREGAR ERROR O WARNING SI NO SE MOVIO NINGUN USUARIO DE LA RUTINA
        setErrors(errors);
        return errors.length===0;
    }

    const handleAssignRoutine = async () => {
        setOpenCircularProgress(true);
        if(validateForm()){
            try {
                const newAsignRoutine = {
                    routine: routineAssigned,
                    user: users,
                    owner: email
                };
                const response = await fetch('http://127.0.0.1:5000/assign_routine_to_user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newAsignRoutine),
                });

                if (!response.ok) {
                    throw new Error('Error al asignar la rutina');
                }
                setOpenCircularProgress(false);
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    navigate(`/?mail=${email}`);
                }, 3000);
            } catch (error) {
                console.error("Error al asignar la rutina:", error);
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
        handleAssignRoutine();
    };

    const handleUsersChange = (newUsers) => {
        setUsers(newUsers);
    };

    return (
        <div className='class-creation-container'>
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
                            Routine successfully assigned!
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
                            Error assigning routine!
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
            { warningFetchingRoutines ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Slide direction="up" in={warningFetchingRoutines} mountOnEnter unmountOnExit >
                            <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                                Error fetching routines. Try again!
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
                                Error assigning routine. Try again!
                            </Alert>
                        </Slide>
                        </Box>
                    </div>
                </div>
            ) : (
                null
            )}
            <div className='class-creation-content'>
                <h2 style={{ color: '#14213D' }}>Assign users</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className="input-small-container">
                            <label htmlFor="routineAssigned" style={{ color: '#14213D' }}>Routine:</label>
                            <select 
                                id="routineAssigned" 
                                name="routineAssigned" 
                                value={routineAssigned} 
                                onChange={(e) => setRoutine(e.target.value)}
                            >
                                <option value="">Select</option>
                                {routines.map((routine) => (
                                    <option key={routine.id} value={routine.name}>
                                        {routine.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="input-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className="input-small-container">
                            <label htmlFor="users" style={{ color: '#14213D' }}>Users:</label>
                            <UsserAssignment onUsersChange={handleUsersChange} routine={routineAssigned}/>
                        </div>
                    </div>
                    <button type="submit" className='button_login'>
                        Assign users
                    </button>
                </form>
            </div>
        </div>
    );
}
