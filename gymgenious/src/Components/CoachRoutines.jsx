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
import ExcersiceAssignment from './ExerciseAssignmentEdition.jsx';

const day = (dateString) => {
  const date = new Date(dateString);
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return daysOfWeek[date.getDay()];
};

function CouchClasses() {
  const [order, setOrder] = useState('asc');
  const [id,setId] = useState()
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [desc, setDesc] = useState('');
  const [fetchDay,setFetchDay] = useState('')
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
  const [name, setName] = useState('');
  const [routines, setRoutines] = useState([]);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [warningFetchingModifiedClasses, setWarningFetchingModifiedClasses] = useState(false);
  const [warningDeletingClasses, setWarningDeletingClasses] = useState(false);
  const [warningFetchingClasses, setWarningFetchingClasses] = useState(false);
  const [warningFetchingRoutines, setWarningFetchingRoutines] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const [type, setType] = useState(null);
  const navigate = useNavigate();

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


  const handleSaveEditRoutine = async () => {
    try {
        const updatedRoutines = {
            rid: id,
            day: day || fetchDay,
            description: desc,
            excers: exercises,
            name: name,
        };
        const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/update_routine_info', {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newRoutine: updatedRoutines })
        });
        if (!response.ok) {
            throw new Error('Error al actualizar la rutina: ' + response.statusText);
        }
        setTimeout(() => {
            setOpenCircularProgress(false);
          }, 2000);
    } catch (error) {
        console.error("Error actualizarndo la rutina:", error);
        setOpenCircularProgress(false);
        setWarningFetchingRoutines(true);
        setTimeout(() => {
            setWarningFetchingRoutines(false);
        }, 3000);
    }
    setEditClass(!editClass);
  }

  const handleEditRoutine = (event) => {
    setEditClass(!editClass);
    setHour('');
    setHourFin('');
    setPermanent('');
    setId(event.id)
    setFetchDay(event.day);
    setName(event.name);
    setDesc(event.description)
  } 

  const handeDeleteRoutine = async (event) => {
    setOpenCircularProgress(true);
    try {
      const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/delete_routine', {
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({event: event})
      });
      if (!response.ok) {
        throw new Error('Error al eliminar la rutina: ' + response.statusText);
      }
      await fetchRoutines();
      setOpenCircularProgress(false);
      handleCloseModal();
    } catch (error) {
      console.error("Error fetching rutinas:", error);
      setOpenCircularProgress(false);
      setWarningDeletingClasses(true);
      setTimeout(() => {
        setWarningDeletingClasses(false);
      }, 3000);
    }
  }

  const fetchRoutines = async () => {
    setOpenCircularProgress(true);
    try {
        const response = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_routines`);
        if (!response.ok) {
            throw new Error('Error al obtener las rutinas: ' + response.statusText);
        }
        const data = await response.json();
        const filteredRoutines = data.filter(event => event.owner.includes(userMail));
        setRoutines(filteredRoutines);
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
    
      const fetchUser = async () => {
        try {
          const encodedUserMail = encodeURIComponent(userMail);
          const response = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_unique_user_by_email?mail=${encodedUserMail}`);
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

    useEffect(() => {
        if (userMail) { 
            fetchRoutines();
        }
    }, [userMail]);

    return (
        <div className="App">
          {type !== 'coach' ? (
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
                <Box sx={{ width: '100%', flexWrap: 'wrap' }}>
                  <Paper
                    sx={{
                      width: '100%',
                      backgroundColor: '#ffe0b5',
                      border: '2px solid #BC6C25',
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
                          <TableRow sx={{ height: '5vh', width: '5vh', color: '#54311a' }}>
                            {/* Table Headers */}
                            {/* ... (your table headers code here) */}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {routines.map((row) => (
                            <TableRow
                              onClick={() => handleSelectEvent(row)}
                              hover
                              tabIndex={-1}
                              key={row.id}
                              sx={{ cursor: 'pointer', borderBottom: '1px solid #ccc' }}
                            >
                              {/* Table Cells */}
                              {/* ... (your table cells code here) */}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {/* Pagination */}
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
                  {/* Modals */}
                  {selectedEvent && (
                    <div className="Modal" onClick={handleCloseModal}>
                      <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Content */}
                        {/* ... (your modal content here) */}
                      </div>
                    </div>
                  )}
                  {editClass && (
                    <div className="Modal-edit-routine" onClick={handleEditRoutine}>
                      <div className="Modal-Content-edit-routine" onClick={(e) => e.stopPropagation()}>
                        {/* Edit Routine Form */}
                        {/* ... (your edit routine form here) */}
                      </div>
                    </div>
                  )}
                </Box>
              </div>
              {/* Backdrop and Alerts */}
              {openCircularProgress && (
                <Backdrop
                  sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                  open={openCircularProgress}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
              )}
              {warningFetchingClasses && (
                <div className="alert-container">
                  <div className="alert-content">
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Slide direction="up" in={warningFetchingClasses} mountOnEnter unmountOnExit>
                        <Alert style={{ fontSize: '100%', fontWeight: 'bold' }} severity="info">
                          Error fetching classes. Try again!
                        </Alert>
                      </Slide>
                    </Box>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      );
      
}

export default CouchClasses;
