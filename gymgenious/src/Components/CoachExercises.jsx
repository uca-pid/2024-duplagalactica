import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { jwtDecode } from "jwt-decode";
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';

export default function CoachExercises() {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [userMail, setUserMail] = useState('');
    const isSmallScreen = useMediaQuery('(max-width:500px)');
    const isSmallScreen250 = useMediaQuery('(max-width:250px)');
    const [openCircularProgress, setOpenCircularProgress] = useState(false);
    const [errorToken, setErrorToken] = useState(false);
    const [warningConnection, setWarningConnection] = useState(false);
    const [exercises, setExercises] = useState([]);
    const navigate = useNavigate();
    const [type, setType] = useState(null);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
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
                throw new Error('Error al obtener los ejercicios: ' + response.statusText);
            }
            const exercisesData = await response.json();
            const filteredExercises = exercisesData.filter(exercise => exercise.owner === userMail);
            
            setExercises(filteredExercises);

            setTimeout(() => {
            setOpenCircularProgress(false);
            }, 2000);
        } catch (error) {
            console.error("Error fetching users:", error);
            setOpenCircularProgress(false);
            setWarningConnection(true);
            setTimeout(() => {
                setWarningConnection(false);
            }, 3000);
        }
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
        if (userMail){
            fetchUser();
        }
    }, [userMail]);

    useEffect(() => {
        if(type==='coach'){
            fetchExercises()
        }
    }, [type])

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

    return (
        <div className="App">
            {type!='coach' ? (
                <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={true}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            ) : (
                <>
                    <NewLeftBar />
                    {openCircularProgress && (
                        <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={openCircularProgress}>
                            <CircularProgress color="inherit" />
                        </Backdrop>
                    )}
                    {warningConnection && (
                        <div className='alert-container'>
                            <div className='alert-content'>
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Slide direction="up" in={warningConnection} mountOnEnter unmountOnExit>
                                    <Alert style={{ fontSize: '100%', fontWeight: 'bold' }} severity="info">
                                        Connection Error. Try again later!
                                    </Alert>
                                </Slide>
                            </Box>
                            </div>
                        </div>
                    )}
                    {errorToken && (
                        <div className='alert-container'>
                            <div className='alert-content'>
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Slide direction="up" in={errorToken} mountOnEnter unmountOnExit>
                                    <Alert style={{ fontSize: '100%', fontWeight: 'bold' }} severity="error">
                                        Invalid Token!
                                    </Alert>
                                </Slide>
                            </Box>
                            </div>
                        </div>
                    )}
                    <div className="Table-Container">
                        <Box sx={{ width: '100%', flexWrap: 'wrap', background: '#ffe0b5', border: '2px solid #BC6C25', borderRadius: '10px' }}>
                            <Paper sx={{ width: '100%', backgroundColor: '#ffe0b5', borderRadius: '10px' }}>
                                <TableContainer>
                                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
                                        <TableHead>
                                            <TableRow sx={{ height: '5vh', width: '5vh' }}>
                                            <TableCell sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', fontWeight: 'bold' }}>
                                                <TableSortLabel
                                                active={orderBy === 'name'}
                                                direction={orderBy === 'name' ? order : 'asc'}
                                                onClick={(event) => handleRequestSort(event, 'name')}
                                                >
                                                Name
                                                {orderBy === 'name' && (
                                                    <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </Box>
                                                )}
                                                </TableSortLabel>
                                            </TableCell>
                                            {!isSmallScreen && (
                                                <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', fontWeight: 'bold', color: '#54311a' }}>
                                                <TableSortLabel
                                                    active={orderBy === 'hour'}
                                                    direction={orderBy === 'hour' ? order : 'asc'}
                                                    onClick={(event) => handleRequestSort(event, 'hour')}
                                                >
                                                    Description
                                                    {orderBy === 'hour' && (
                                                    <Box component="span" sx={visuallyHidden}>
                                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </Box>
                                                    )}
                                                </TableSortLabel>
                                                </TableCell>
                                            )}
                                            {!isSmallScreen250 && (
                                                <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', fontWeight: 'bold', color: '#54311a' }}>
                                                <TableSortLabel
                                                    active={orderBy === 'dateInicio'}
                                                    direction={orderBy === 'dateInicio' ? order : 'asc'}
                                                    onClick={(event) => handleRequestSort(event, 'dateInicio')}
                                                >
                                                    Teacher
                                                    {orderBy === 'dateInicio' && (
                                                    <Box component="span" sx={visuallyHidden}>
                                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </Box>
                                                    )}
                                                </TableSortLabel>
                                                </TableCell>
                                            )}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {exercises.map((row) => (
                                                <TableRow onClick={() => handleSelectEvent(row)} hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer', borderBottom: '1px solid #ccc' }}>
                                                        <TableCell component="th" scope="row" sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', color: '#54311a' }}>
                                                            {row.name}
                                                        </TableCell>
                                                    {!isSmallScreen && (
                                                        <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', color: '#54311a' }}>
                                                            {row.description}
                                                        </TableCell>
                                                    )}
                                                    {!isSmallScreen250 && (
                                                        <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', color: '#54311a' }}>
                                                            {row.owner}
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={exercises.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                        </Box>
                    </div>
                    {selectedEvent && (
                        <div className="Modal" onClick={handleCloseModal}>
                            <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
                                <h2>Exercise {selectedEvent.name}</h2>
                                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                    <TableContainer sx={{ maxHeight: 440 }}>
                                        <Table stickyHeader aria-label="sticky table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Exercise</TableCell>
                                                    <TableCell>Series</TableCell>
                                                    <TableCell>Reps</TableCell>
                                                    <TableCell>Timing</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow key={selectedEvent.id}>
                                                    <TableCell>{selectedEvent.name}</TableCell>
                                                    <TableCell>{selectedEvent.series} x</TableCell>
                                                    <TableCell>{selectedEvent.reps.join(', ')}</TableCell>
                                                    <TableCell>{selectedEvent.timing}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                                <button onClick={handleCloseModal}>Close</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
