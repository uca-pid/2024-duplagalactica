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
import { mobileAndDesktopOS, valueFormatter } from './webUsageStats.ts';

function BarAnimation({ routines }) {
    const [itemNb, setItemNb] = React.useState(5);
  
    // Mapeamos los nombres de las rutinas y los datos
    const routineNames = routines?.map(routine => routine.name);
    const routineData = routines?.map(routine => routine.cant_asignados);
  
    const handleItemNbChange = (event, newValue) => {
      if (typeof newValue !== 'number') {
        return;
      }
      setItemNb(newValue);
    };
  
    return (
      <Box sx={{ width: '100%' }}>
        <BarChart
          height={300}
          series={[{
            data: routineData.slice(0, itemNb), // Datos de los asignados
          }]}
          xAxis={[{
            scaleType: 'band', // Aquí está la corrección: eje X de tipo "band"
            data: routineNames.slice(0, itemNb), // Nombres de las rutinas en el eje X
          }]}
        />
        <Typography id="input-item-number" gutterBottom>
          Número de rutinas
        </Typography>
        <Slider
          value={itemNb}
          onChange={handleItemNbChange}
          valueLabelDisplay="auto"
          min={1}
          max={routines.length}
          aria-labelledby="input-item-number"
        />
        <PieChart
        height={300}
        series={[
          {
            data: mobileAndDesktopOS.slice(0, itemNb),
            innerRadius: 50,
            arcLabel: (params) => params.label ?? '',
            arcLabelMinAngle: 20,
            valueFormatter,
          },
        ]}
      />
      </Box>
    );
  }

  

const day = (dateString) => {
  const date = new Date(dateString);
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return daysOfWeek[date.getDay()];
};

function TopRoutines() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('users');
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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
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
      console.log("rutinas", routines[0].id)
      console.log("assigned routines",assignedRoutines[0].id)
      const routinesWithAssignedCount = routines.map((routine) => {
        const assignedCount = assignedRoutines
          .filter((assigned) => assigned.id === routine.id)  
        return {
          ...routine,
          cant_asignados: assignedCount.length || 0,
        };
      });
      console.log("resultado", routinesWithAssignedCount)
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
            fetchRoutines();
        }
    }, [userMail]);

      useEffect(() => {
        if(isMobileScreen) {
          setMaxHeight('700px');
        } else {
          setMaxHeight('600px')
        }
      }, [isSmallScreen, isMobileScreen])

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
        {!userMail ? (
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
                              <TableSortLabel active={orderBy === 'day'} direction={orderBy === 'day' ? order : 'asc'} onClick={(event) => handleRequestSort(event, 'day')}>
                                Owner
                                {orderBy === 'day' ? (
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
                              <TableSortLabel active={orderBy === 'excercises.length'} direction={orderBy === 'excercises.length' ? order : 'asc'} onClick={(event) => handleRequestSort(event, 'excercises.length')}>
                                Exercises
                                {orderBy === 'excercises.length' ? (
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
                              <TableSortLabel active={orderBy === 'users'} direction={orderBy === 'users' ? order : 'asc'} onClick={(event) => handleRequestSort(event, 'users')}>
                                Users
                                {orderBy === 'users' ? (
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
                        {visibleRows.length===0 ? (
                            <TableRow>
                            <TableCell colSpan={isSmallScreen ? 2 : 4} align="center" sx={{ color: '#54311a', borderBottom: '1px solid #BC6C25' }}>
                                There are no created routines
                            </TableCell>
                            </TableRow>
                        ) : (
                          <>
                            {visibleRows.map((row) => (
                              <TableRow onClick={()=>handleSelectEvent(row)} hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer', borderBottom: '1px solid #ccc' }}>
                                <TableCell component="th" scope="row" sx={{ borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25', color:'#54311a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>
                                  {row.name}
                                </TableCell>
                                {!isSmallScreen && (
                                  <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25',color:'#54311a' }}>
                                    {row.owner}
                                  </TableCell>
                                )}
                                {!isSmallScreen250 && (
                                  <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25',color:'#54311a' }}>
                                    {row.excercises.length}
                                  </TableCell>
                                )}
                                {!isSmallScreen && (
                                  <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25',color:'#54311a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>
                                    {row.cant_asignados} 
                                  </TableCell>
                                )}
                              </TableRow>
                            ))}
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {visibleRows.length!=0 ? (
                    <>
                        <TablePagination
                            rowsPerPageOptions={[5]}
                            component="div"
                            count={routines.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                        />
                    </>
                  ) : (
                    null
                  )}
                </Paper>
              </Box>
              <BarAnimation routines={routines}/>
            </div>
            {selectedEvent && (
              <div className="Modal" onClick={handleCloseModal}>
                <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
                  <h2>Routine details</h2>
                  <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}><strong>Name:</strong> {selectedEvent.name}</p>
                  <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}><strong>Description:</strong> {selectedEvent.description}</p>
                  <p><strong>Exercises:</strong> {selectedEvent.excercises.length}</p>
                  <p><strong>Users:</strong> {selectedEvent.cant_asignados}</p>
                  <p><strong>Owner:</strong> {selectedEvent.owner}</p>
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
                                        {selectedEvent?.excercises?.map((exercise) => (
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

export default TopRoutines;
