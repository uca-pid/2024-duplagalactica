import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { useState, useEffect } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { jwtDecode } from "jwt-decode";
import NewLeftBar from '../real_components/NewLeftBar';
import ColorToggleButton from '../real_components/ColorToggleButton.jsx';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import DaySelection from '../real_components/DaySelection.jsx';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

export default function StickyHeadTable() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [orderBy, setOrderBy] = useState('name');
    const [order, setOrder] = useState('asc');
    const [userMail, setUserMail] = useState('');
    const [visibleRows, setVisibleRows] = useState([]);
    const [routine, setRoutines] = useState([]);
    const [selectedDay, setSelectedDay] = useState('');
    const isSmallScreen = useMediaQuery('(max-width:700px)');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [viewExercises, setViewExercises] = useState(false);
    const [rows, setRows] = useState([]);
    const [errorToken, setErrorToken] = useState(false);
    const [openCircularProgress, setOpenCircularProgress] = useState(false);
    const [dense, setDense] = useState(false);
    const navigate = useNavigate();
    const [type, setType] = useState(null);
    const [warningFetchingUserRoutines, setWarningFetchingUserRoutines] = useState(false);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        fetchRoutineWithExercises(event.routine);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
        setViewExercises(false);
    };

    const handleViewExercises = () => {
        setViewExercises(!viewExercises);
    };

    const fetchRoutines = async () => {
        setOpenCircularProgress(true);
        try {            
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
              console.error('Token no disponible en localStorage');
              return;
            }
            const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_assigned_routines', {
                method: 'GET', 
                headers: {
                  'Authorization': `Bearer ${authToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener las rutinas: ' + response.statusText);
            }
            const data = await response.json();
            const filteredRows = data.filter((row) =>
                row.user.some((u) => u.Mail === userMail)
            );
            setRows(filteredRows);
            console.log(data);
            console.log(filteredRows);
            setOpenCircularProgress(false);
        } catch (error) {
            setOpenCircularProgress(false);
            console.error("Error fetching classes:", error);
            setWarningFetchingUserRoutines(true);
            setTimeout(() => {
                setWarningFetchingUserRoutines(false);
            }, 3000);
        }
    };

    const fetchRoutineWithExercises = async (routineName) => {
        setOpenCircularProgress(true);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
              console.error('Token no disponible en localStorage');
              return;
            }
            const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_routines', {
                method: 'GET', 
                headers: {
                  'Authorization': `Bearer ${authToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener las rutinas: ' + response.statusText);
            }
            const data = await response.json();
            const filteredRows = data.filter((row) => row.name === routineName);
            setRoutines(filteredRows[0]);
            setOpenCircularProgress(false);
        } catch (error) {
            setOpenCircularProgress(false);
            console.error("Error fetching exercises:", error);
            setWarningFetchingUserRoutines(true);
            setTimeout(() => {
                setWarningFetchingUserRoutines(false);
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
            return;
        }
        if (userMail){
          fetchUser();
        }
      }, [userMail]);

      useEffect(() => {
        if(type==='client'){
            fetchRoutines();
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
            if(data.type!='client'){
              navigate('/');
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
      };

    useEffect(() => {
        if (selectedDay) {
            const filteredRows = rows.filter((row) => row.day === selectedDay);
            setVisibleRows(filteredRows);
        } else {
            setVisibleRows(rows);
        }
    }, [rows, selectedDay]);

    return (
        <div className="App">
            {type!='client' ? (
            <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        ) : (
          <>
            <NewLeftBar />
            <div className="Table-Container">
                {!isSmallScreen ? (
                    <ColorToggleButton selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
                ) : (
                    <DaySelection selectedDay={selectedDay} setSelectedDay={setSelectedDay}/>
                )}
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
                                                {orderBy === 'name' ? (
                                                    <Box component="span" sx={visuallyHidden}>
                                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </Box>
                                                ) : null}
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', fontWeight: 'bold', color: '#54311a' }}
                                        >
                                            Day
                                        </TableCell>
                                        {!isSmallScreen && (
                                            <TableCell
                                                align="right"
                                                sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', fontWeight: 'bold', color: '#54311a' }}
                                            >
                                                Teacher
                                            </TableCell>
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {visibleRows.map((row) => (
                                        <TableRow onClick={() => handleSelectEvent(row)} hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer', borderBottom: '1px solid #ccc' }}>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', color: '#54311a' }}
                                            >
                                                {row.routine}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', color: '#54311a' }}
                                            >
                                                {row.day}
                                            </TableCell>
                                            {!isSmallScreen && (
                                                <TableCell
                                                    align="right"
                                                    sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', color: '#54311a' }}
                                                >
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
                            count={visibleRows.length}
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
                        <h2>Routine details</h2>
                        <p><strong>Name:</strong> {routine.name}</p>
                        <p><strong>Description:</strong> {routine.description}</p>
                        <p><strong>Day:</strong> {routine.day}</p>
                        <p><strong>Exercises:</strong> {routine.excercises ? routine.excercises.length : 0}</p>
                        <p><strong>Teacher:</strong> {routine.owner}</p>
                        <button onClick={handleViewExercises}>View exercises</button>
                        <button onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            )}
            {viewExercises && (
                <div className="Modal" onClick={handleViewExercises}>
                    <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
                        <h2>Exercises from {selectedEvent.routine}</h2>
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
                                        {routine?.excercises?.map((exercise) => (
                                            <TableRow key={exercise.id}>
                                                <TableCell>{exercise.name}</TableCell>
                                                <TableCell>{exercise.series} x</TableCell>
                                                <TableCell>{exercise.reps.join(', ')}</TableCell>
                                                <TableCell>{exercise.timing}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                        <button onClick={handleViewExercises}>Close</button>
                    </div>
                </div>
            )}
            {openCircularProgress && (
                <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={openCircularProgress}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
            { warningFetchingUserRoutines ? (
                    <div className='alert-container'>
                        <div className='alert-content'>
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Slide direction="up" in={warningFetchingUserRoutines} mountOnEnter unmountOnExit >
                                <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                                    Connection error. Try again later!
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
