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
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';


const day = (dateString) => {
  const date = new Date(dateString);
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return daysOfWeek[date.getDay()];
};

function CoachRoutines() {
  const [order, setOrder] = useState('asc');
  const [id,setId] = useState()
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [desc, setDesc] = useState('');
  const [exercises, setExercises] = useState([]);
  const [day, setDay] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editClass, setEditClass] = useState(false);
  const [userMail,setUserMail] = useState(null)
  const isSmallScreen = useMediaQuery('(max-width:700px)');
  const isSmallScreen250 = useMediaQuery('(max-width:400px)');
  const [fetchName,setNameFetch] = useState('');
  const [dayFetch,setDayFetch] = useState('');
  const [descFetch,setDescFetch]= useState('');
  const [exersFetch,setExersFetch]= useState([]);
  const [routineFetch,setRoutine] = useState({});
  const [name, setName] = useState('');
  const [routines, setRoutines] = useState([]);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [warningConnection, setWarningConnection] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const [type, setType] = useState(null);
  const navigate = useNavigate();
  const isMobileScreen = useMediaQuery('(min-height:750px)');
  const [maxHeight, setMaxHeight] = useState('600px');

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
            ...routineFetch,
            rid: id,
            day: day || dayFetch,
            description: desc || descFetch,
            excers: exercises || exersFetch,
            name: name || fetchName,
        };
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token no disponible en localStorage');
          return;
        }
        const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/update_routine_info', {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
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
        setWarningConnection(true);
        setTimeout(() => {
          setWarningConnection(false);
        }, 3000);
        setEditClass(!editClass);
      }
  }

  const saveRoutine = async (event) => {
      event.preventDefault(); 
      handleSaveEditRoutine();
      setEditClass(!editClass);
      setTimeout(() => {
        setOpenCircularProgress(false);
      }, 7000);
      await fetchRoutines();
      window.location.reload()
  }

  const handleEditRoutine = (event) => {
    setEditClass(!editClass);
    console.log("este es el evento",event)
    setId(event.id)
    setNameFetch(event.name);
    setDayFetch(event.day);
    setDescFetch(event.description);
    setExersFetch(event.exercises);
    setRoutine(event);
    console.log(dayFetch)
  } 

  const handeDeleteRoutine = async (event) => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/delete_routine', {
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
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
      setWarningConnection(true);
      setTimeout(() => {
        setWarningConnection(false);
      }, 3000);
    }
  }

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
        const data = await response.json();
        const filteredRoutines = await data.filter(event => event.owner.includes(userMail));
        setRoutines(filteredRoutines);
        setOpenCircularProgress(false);
    } catch (error) {
        console.error("Error fetching rutinas:", error);
        setOpenCircularProgress(false);
        setWarningConnection(true);
        setTimeout(() => {
          setWarningConnection(false);
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

    useEffect(() => {
        if (userMail) { 
            fetchRoutines();
        }
    }, [userMail]);

    const visibleRows = React.useMemo(
      () =>
        [...routines]
          .sort((a, b) =>
            order === 'asc'
              ? a[orderBy] < b[orderBy]
                ? -1
                : 1
              : a[orderBy] > b[orderBy]
              ? -1
              : 1
          )
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
      [order, orderBy, page, rowsPerPage, routines]
    );

    return (
      <div className="App">
        {type!='coach' ? (
          <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={true}>
              <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <>
            <NewLeftBar/>
            <div className="Table-Container">
            <Box sx={{ width: '100%', flexWrap: 'wrap', background: '#ffe0b5', border: '2px solid #BC6C25', borderRadius: '10px' }}>
              <Paper
                  sx={{
                  width: '100%',
                  backgroundColor: '#ffe0b5',
                  borderRadius: '10px'
                  }}
              >
                  <TableContainer sx={{maxHeight: {maxHeight}, overflow: 'auto'}}>
                      <Table
                          sx={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          }}
                          aria-labelledby="tableTitle"
                          size={dense ? 'small' : 'medium'}
                      >
                          <TableHead>
                              <TableRow sx={{ height: '5vh', width: '5vh' }}>
                                  <TableCell sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', fontWeight: 'bold' }}>
                            <TableSortLabel active={orderBy === 'name'} direction={orderBy === 'name' ? order : 'asc'} onClick={(event) => handleRequestSort(event, 'name')}>
                              Name
                              {orderBy === 'name' ? (
                              <Box component="span" sx={visuallyHidden}>
                                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                              </Box>
                              ) : (
                                null
                              )}
                            </TableSortLabel>
                          </TableCell>
                          {!isSmallScreen && (
                            <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25', fontWeight: 'bold',color:'#54311a' }}>
                              <TableSortLabel active={orderBy === 'hour'} direction={orderBy === 'hour' ? order : 'asc'} onClick={(event) => handleRequestSort(event, 'hour')}>
                                Day
                                {orderBy === 'hour' ? (
                                    <Box component="span" sx={visuallyHidden}>
                                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : (
                                  null
                                )}
                              </TableSortLabel>
                            </TableCell>
                          )}
                          {!isSmallScreen250 && (
                            <TableCell align="right" sx={{borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25', fontWeight: 'bold',color:'#54311a' }}>
                              <TableSortLabel active={orderBy === 'dateInicio'} direction={orderBy === 'dateInicio' ? order : 'asc'} onClick={(event) => handleRequestSort(event, 'dateInicio')}>
                                Exercises
                                {orderBy === 'dateInicio' ? (
                                    <Box component="span" sx={visuallyHidden}>
                                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : (
                                  null
                                )}
                              </TableSortLabel>
                            </TableCell>
                          )}
                          {!isSmallScreen && (
                            <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25', fontWeight: 'bold',color:'#54311a' }}>
                              <TableSortLabel active={orderBy === 'permanent'} direction={orderBy === 'permanent' ? order : 'asc'} onClick={(event) => handleRequestSort(event, 'permanent')}>
                                Description
                                {orderBy === 'permanent' ? (
                                    <Box component="span" sx={visuallyHidden}>
                                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : (
                                  null
                                )}
                              </TableSortLabel>
                            </TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {visibleRows.map((row) => (
                          <TableRow onClick={()=>handleSelectEvent(row)} hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer', borderBottom: '1px solid #ccc' }}>
                            <TableCell component="th" scope="row" sx={{ borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25', color:'#54311a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>
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
                              <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25',color:'#54311a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>
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
                        count={routines.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                    />
                    ) : (
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={routines.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                    )}
                </Paper>
              </Box>
            </div>
            {selectedEvent && (
              <div className="Modal" onClick={handleCloseModal}>
                <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
                  <h2>Routine details</h2>
                  <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}><strong>Name:</strong> {selectedEvent.name}</p>
                  <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}><strong>Description:</strong> {selectedEvent.description}</p>
                  <p><strong>Day:</strong> {selectedEvent.day}</p>
                  <p><strong>Exercises:</strong> {selectedEvent.excercises.length}</p>
                  <p><strong>Users:</strong> {5}</p>
                  <button onClick={()=> handleEditRoutine(selectedEvent)}>Edit routine</button>
                  <button onClick={handleCloseModal}>Close</button>
                  <button onClick={()=> handeDeleteRoutine(selectedEvent)}>Delete routine</button>
                </div>
              </div>
            )}
            {editClass && (
              <div className="Modal-edit-routine" onClick={handleCloseModal}>
                <div className="Modal-Content-edit-routine" onClick={(e) => e.stopPropagation()}>
                  <h2>Routine details</h2>
                  <form autoComplete='off' onSubmit={saveRoutine}>
                    <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                      <div className="input-small-container">
                        <label htmlFor="name" style={{color:'#14213D'}}>Name:</label>
                        <input
                        type="text" 
                        id="name" 
                        name="name" 
                        value={name} 
                        placeholder={fetchName}
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
                        placeholder={descFetch}
                        onChange={(e) => setDesc(e.target.value)} 
                        />
                      </div>
                    </div>
                    <div className="input-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div className="input-small-container">
                        <label htmlFor="users" style={{ color: '#14213D' }}>Exercises:</label>
                        <UsserAssignment onUsersChange={handleExcersiceChange} routine={id}/>
                      </div>
                    </div>
                    <button onClick={handleCloseModal} className='button_login'>Cancell</button>
                    <button type="submit" className='button_login'>Save changes</button>
                  </form>
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


function UsserAssignment({onUsersChange,routine}) {
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [userMail,setUserMail] = useState(null);
  const [right, setRight] = useState([]);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [warningFetchingExercises, setWarningFetchingExercises] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:950px)');

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);
  useEffect(() => {
    onUsersChange(right); 
  }, [right, onUsersChange]);

  const correctExercisesData = async (exercisesData) => {
    let autoIncrementId=0;
    return exercisesData.map(element => {
        if (!element.series) {
            autoIncrementId++;
            return {
                id: autoIncrementId,
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
      const response = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_routines`, {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
    });
      if (!response.ok) {
        throw new Error('Error al obtener las rutinas: ' + response.statusText);
      }
      const routinesData = await response.json();
      const filteredRoutines = routinesData.filter(event => event.id === routine);
      const response2 = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_excersices`, {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
    });
      if (!response2.ok) {
          throw new Error('Error al obtener los ejercicios: ' + response2.statusText);
        }
        const exercisesData = await response2.json();
  
      const response3 = await fetch(`https://train-mate-api.onrender.com/api/exercise/get-all-exercises`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
      });
      const exercisesDataFromTrainMate = await response3.json();
      const totalExercises = exercisesData.concat(exercisesDataFromTrainMate.exercises);
      const totalExercisesCorrected = await correctExercisesData(totalExercises);

      const exercisesInRoutines = new Set();
      await filteredRoutines.forEach(routine => {
        routine.excercises.forEach(exercise => {
          exercisesInRoutines.add(exercise.id);
        });
      });
      console.log(exercisesInRoutines.has(100000))
      const right = totalExercisesCorrected.filter(exercise => 
        exercisesInRoutines.has(exercise.id)
      );
      const left = totalExercisesCorrected.filter(exercise => 
        !exercisesInRoutines.has(exercise.id)
      ); 
      console.log(right)
      setRight(right); 
      setLeft(left);    
  
      setTimeout(() => {
        setOpenCircularProgress(false);
      }, 2000);
    } catch (error) {
      console.error("Error fetching users:", error);
      setOpenCircularProgress(false);
      setWarningFetchingExercises(true);
      setTimeout(() => {
        setWarningFetchingExercises(false);
      }, 3000);
    }
  };
  
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    const newRight = right.concat(left);
    setRight(newRight);
    setLeft([]);
    onUsersChange(newRight);
  };

  const handleCheckedRight = () => {
    const newRight = right.concat(leftChecked);
    setRight(newRight);
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
    onUsersChange(newRight);
  };

  const handleCheckedLeft = () => {
    const newLeft = left.concat(rightChecked);
    setLeft(newLeft);
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
    onUsersChange(newLeft); 
  };

  const handleAllLeft = () => {
    const newLeft = left.concat(right);
    setLeft(newLeft);
    setRight([]);
    onUsersChange(newLeft); 
  };

  const customList = (items) => (
    <Paper className='transfer-list-modal'>
      <List dense component="div" role="list">
        {items.map((exercise) => {
          const labelId = `transfer-list-item-${exercise.name}-label`;

          return (
            <ListItemButton
              key={exercise.id}
              role="listitem"
              onClick={handleToggle(exercise)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.includes(exercise)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              {isSmallScreen ? (
                <ListItemText id={labelId}><p style={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', color: '#54311a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{exercise.name}</p></ListItemText>
              ) : (
                <ListItemText id={labelId}><p style={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', color: '#54311a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px'}}>{exercise.name}</p></ListItemText>
              )}
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );

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
    if (userMail) {
      fetchExercises();
    }
  }, [userMail]);


  const verifyToken = async (token) => {
    setOpenCircularProgress(true);
    try {
        const decodedToken = jwtDecode(token);
        setUserMail(decodedToken.email);
        setOpenCircularProgress(false);
    } catch (error) {
        console.error('Error al verificar el token:', error);
        setOpenCircularProgress(false);
        throw error;
    }
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{ justifyContent: 'center', alignItems: 'center' }}
      className='grid-transfer-container'
    >
      {!isSmallScreen ? (
        <>
      <Grid className='grid-transfer-content' item>{customList(left)}</Grid>
        <Grid item>
        <Grid container direction="column" sx={{ alignItems: 'center' }}>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllRight}
            disabled={left.length === 0}
            aria-label="move all right"
          >
            ≫
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllLeft}
            disabled={right.length === 0}
            aria-label="move all left"
          >
            ≪
          </Button>
        </Grid>
      </Grid>
      {right.length===0 ? (
        <Grid className='grid-transfer-content' item>{customList([{'id':'1','name':'No exercises were chosen'}])}</Grid>
      ) : (
        <Grid className='grid-transfer-content' item>{customList(right)}</Grid>
      )}
      </>
      ) : (
        <Grid className='grid-transfer-content-small-screen-modal' item>{customList(left)}</Grid>
      )}
      {openCircularProgress ? (
                <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openCircularProgress}
                >
                <CircularProgress color="inherit" />
                </Backdrop>
            ) : null}
      { warningFetchingExercises ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Slide direction="up" in={warningFetchingExercises} mountOnEnter unmountOnExit >
                            <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                                Error fetching exercises. Try again!
                            </Alert>
                        </Slide>
                        </Box>
                    </div>
                </div>
            ) : (
                null
            )}
    </Grid>
  );
}

function not(a, b) {
  return a.filter((value) => !b.includes(value));
}

function intersection(a, b) {
  return a.filter((value) => b.includes(value));
}

export default CoachRoutines;
