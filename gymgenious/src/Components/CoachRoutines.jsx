import React, {useState, useEffect} from 'react';
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
import NewLeftBar from '../real_components/NewLeftBar'
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import {jwtDecode} from "jwt-decode";
import ExcersiceAssignment from './ExcersiceAssignment.jsx';

const day = (dateString) => {
  const date = new Date(dateString);
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return daysOfWeek[date.getDay()];
};

function CouchClasses() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [desc, setDesc] = useState('');
  const [exercises, setExercises] = useState('');
  const [day, setDay] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editClass, setEditClass] = useState(false);
  const [userMail,setUserMail] = useState(null)
  const isSmallScreen = useMediaQuery('(max-width:500px)');
  const isSmallScreen250 = useMediaQuery('(max-width:250px)');
  const [visibleRows,setClasses]=useState([])
  const [hour, setHour] = useState('');
  const [hourFin, setHourFin] = useState('');
  const [permanent, setPermanent] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [routines, setRoutines] = useState([]);
  const navigate = useNavigate();
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [warningFetchingModifiedClasses, setWarningFetchingModifiedClasses] = useState(false);
  const [warningDeletingClasses, setWarningDeletingClasses] = useState(false);
  const [warningFetchingClasses, setWarningFetchingClasses] = useState(false);
  const [warningFetchingRoutines, setWarningFetchingRoutines] = useState(false);
  const [errorToken,setErrorToken] = useState(false);

//   const day = (dateString) => {
//     const date = new Date(dateString);
//     const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
//     return daysOfWeek[date.getDay()];
//   };

  const handleExcersiceChange = (newExcersices) => {
        setExercises(newExcersices);
  };

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

  const handleEditRoutine = () => {
    setEditClass(!editClass);
    setHour('');
    setHourFin('');
    setPermanent('');
    setDate('');
    setName('');
  } 
//   const fetchModifyClassInformation = async () => {
//     setOpenCircularProgress(true);
//     try {
//         const isoDateStringInicio = `${date}T${hour}:00Z`;
//         const isoDateStringFin = `${date}T${hourFin}:00Z`;
//         const updatedUser = {
//             NameOriginal: selectedEvent.name,
//             DateFin: isoDateStringFin,
//             DateInicio: isoDateStringInicio,
//             Day: day(date),
//             Name: name,
//             Permanent: permanent
//         };
//         const response = await fetch('http://127.0.0.1:5000/update_class_info', {
//             method: 'PUT', 
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ newUser: updatedUser })
//         });

//         if (!response.ok) {
//             throw new Error('Error al actualizar los datos del usuario: ' + response.statusText);
//         }
//         const data = await response.json();
//         await fetchRoutines();
//         setOpenCircularProgress(false);
//         handleCloseModal(); 
//     } catch (error) {
//         console.error("Error updating user:", error);
//         setOpenCircularProgress(false);
//         setWarningFetchingModifiedClasses(true);
//         setTimeout(() => {
//           setWarningFetchingModifiedClasses(false);
//         }, 3000);
//     }
// };

//   const handleDeleteClass = async (event) => {
//     setOpenCircularProgress(true);
//     try {
//       const response = await fetch('http://127.0.0.1:5000/delete_class', {
//         method: 'DELETE', 
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ event: event,mail:userMail })
//       });
//       if (!response.ok) {
//         throw new Error('Error al actualizar la clase: ' + response.statusText);
//       }
//       await fetchRoutines();
//       setOpenCircularProgress(false);
//       handleCloseModal();
//     } catch (error) {
//       console.error("Error fetching classes:", error);
//       setOpenCircularProgress(false);
//       setWarningDeletingClasses(true);
//       setTimeout(() => {
//         setWarningDeletingClasses(false);
//       }, 3000);
//     }
//   };

  const fetchRoutines = async () => {
    setOpenCircularProgress(true);
    try {
        const response = await fetch(`http://127.0.0.1:5000/get_routines`);
        if (!response.ok) {
            throw new Error('Error al obtener las rutinas: ' + response.statusText);
        }
        const data = await response.json();
        const filteredRoutines = data.filter(event => event.owner.includes(userMail));
        setRoutines(filteredRoutines);
        console.log(routines);
        setTimeout(() => {
            setOpenCircularProgress(false);
          }, 2000);
    } catch (error) {
        console.error("Error fetching rutinas:", error);
        setOpenCircularProgress(false);
        setWarningFetchingRoutines(true);
        setTimeout(() => {
            setWarningFetchingRoutines(false);
        }, 3000);
    }
}

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
    console.log('Token:', token);
    if (token) {
        verifyToken(token);
    } else {
        console.error('No token found');
    }
  }, []);

  useEffect(() => {
    fetchRoutines();
  }, [userMail])


  return (
    <div className="App">
        <NewLeftBar/>
        {openCircularProgress ? (
                <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openCircularProgress}
                >
                <CircularProgress color="inherit" />
                </Backdrop>
            ) : null}
      { warningFetchingClasses ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Slide direction="up" in={warningFetchingClasses} mountOnEnter unmountOnExit >
                            <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                                Error fetching classes. Try again!
                            </Alert>
                        </Slide>
                        </Box>
                    </div>
                </div>
            ) : (
                null
            )}
            { warningDeletingClasses ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Slide direction="up" in={warningDeletingClasses} mountOnEnter unmountOnExit >
                            <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                                Error deleting class. Try again!
                            </Alert>
                        </Slide>
                        </Box>
                    </div>
                </div>
            ) : (
                null
            )}
            { warningFetchingModifiedClasses ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Slide direction="up" in={warningFetchingModifiedClasses} mountOnEnter unmountOnExit >
                            <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                                Error fetching modified class. Try again!
                            </Alert>
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
        <div className="Table-Container">
            <Box sx={{ width: '100%', flexWrap: 'wrap' }}>
            <Paper 
                sx={{ 
                width: '100%',
                backgroundColor: '#ffe0b5',
                border: '2px solid #BC6C25'
                }}
            >
                <TableContainer>
                <Table 
                    sx={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    }} 
                    aria-labelledby="tableTitle" 
                    size={dense ? 'small' : 'medium'}
                >
                    <TableHead>
                    <TableRow sx={{height: '5vh',width:'5vh',color:'#54311a' }}>
                        <TableCell sx={{ borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25', fontWeight: 'bold' }}>
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
                        {!isSmallScreen && (
                        <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25', fontWeight: 'bold',color:'#54311a' }}>
                            <TableSortLabel
                            active={orderBy === 'hour'}
                            direction={orderBy === 'hour' ? order : 'asc'}
                            onClick={(event) => handleRequestSort(event, 'hour')}
                            >
                            Day
                            {orderBy === 'hour' ? (
                                <Box component="span" sx={visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                            </TableSortLabel>
                        </TableCell>
                        )}
                        {!isSmallScreen250 && (
                        <TableCell align="right" sx={{borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25', fontWeight: 'bold',color:'#54311a' }}>
                            <TableSortLabel
                            active={orderBy === 'dateInicio'}
                            direction={orderBy === 'dateInicio' ? order : 'asc'}
                            onClick={(event) => handleRequestSort(event, 'dateInicio')}
                            >
                            Exercises
                            {orderBy === 'dateInicio' ? (
                                <Box component="span" sx={visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                            </TableSortLabel>
                        </TableCell>
                        )}
                        {!isSmallScreen && (
                        <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25', fontWeight: 'bold',color:'#54311a' }}>
                            <TableSortLabel
                            active={orderBy === 'permanent'}
                            direction={orderBy === 'permanent' ? order : 'asc'}
                            onClick={(event) => handleRequestSort(event, 'permanent')}
                            >
                            Description
                            {orderBy === 'permanent' ? (
                                <Box component="span" sx={visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                            </TableSortLabel>
                        </TableCell>
                        )}
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {routines.map((row) => (
                        <TableRow onClick={()=>handleSelectEvent(row)} hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer', borderBottom: '1px solid #ccc' }}>
                            <TableCell component="th" scope="row" sx={{ borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25',color:'#54311a' }}>
                                {row.name}
                            </TableCell>
                        {!isSmallScreen && (
                            <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25',color:'#54311a' }}>
                                {row.day}
                            </TableCell>
                        )}
                        {!isSmallScreen250 && (
                            <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25',color:'#54311a' }}>
                                {row.excercises.length}
                            </TableCell>
                        )}
                        {!isSmallScreen && (
                            <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25',color:'#54311a' }}>
                                {row.description} 
                            </TableCell>
                        )}
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
                {isSmallScreen ? (
                <TablePagination
                rowsPerPageOptions={[10]}
                component="div"
                count={visibleRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                />
            ) : (
                <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={visibleRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}
              
            </Paper>
            {selectedEvent && (
                <div className="Modal" onClick={handleCloseModal}>
                    <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
                    <h2>Routine details</h2>
                    <p><strong>Name:</strong> {selectedEvent.name}</p>
                    <p><strong>Description:</strong> {selectedEvent.description}</p>
                    <p><strong>Day:</strong> {selectedEvent.day}</p>
                    <p><strong>Exercises:</strong> {selectedEvent.excercises.length}</p>
                    <button onClick={handleEditRoutine}>Edit routine</button>
                    <button onClick={handleCloseModal}>Close</button>
                    <button onClick={handleCloseModal}>Delete routine</button>
                    </div>
                </div>
                )}
            {editClass && (
                <div className="Modal-edit-routine" onClick={handleEditRoutine}>
                    <div className="Modal-Content-edit-routine" onClick={(e) => e.stopPropagation()}>
                    <h2>Routine details</h2>
                    <form>
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
                        <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
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
                        <div className="input-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className="input-small-container">
                                <label htmlFor="users" style={{ color: '#14213D' }}>Exercises:</label> 
                                <ExcersiceAssignment onUsersChange={handleExcersiceChange} owner={userMail}/>
                            </div>
                        </div>
                        <button onClick={handleEditRoutine} className='button_login'>
                            Cancell
                        </button>
                        <button onClick={handleEditRoutine} type="submit" className='button_login'>
                            Save changes
                        </button>
                    </form>
                    </div>
                </div>
                )}
            </Box>
        </div>
    </div>
  );
  
  
}

// CouchClasses.propTypes = {
//   rows: PropTypes.array.isRequired,
// };

export default CouchClasses;
