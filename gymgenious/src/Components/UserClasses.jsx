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

function UsserClasses() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userMail, setUserMail] = useState('');
  const [classes, setClasses] = useState([]);
  const isSmallScreen400 = useMediaQuery('(max-width:400px)');
  const isSmallScreen500 = useMediaQuery('(max-width:500px)');
  const isSmallScreen600 = useMediaQuery('(max-width:600px)');
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [errorToken, setErrorToken] = useState(false);
  const [warningFetchingClasses, setWarningFetchingClasses] = useState(false);
  const [successUnbook, setSuccessUnbook] = useState(false);
  const [warningUnbookingClass, setWarningUnbookingClass] = useState(false);
  const navigate = useNavigate();
  const [type, setType] = useState(null);
  const isMobileScreen = useMediaQuery('(min-height:750px)');
  const [maxHeight, setMaxHeight] = useState('600px');

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
  
  const handleUnbookClass = async (event) => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/unbook_class', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ event: event, mail: userMail })
      });
      if (!response.ok) {
        throw new Error('Error al actualizar la clase: ' + response.statusText);
      }
      await fetchClasses();
      setOpenCircularProgress(false);
      handleCloseModal();
      setSuccessUnbook(true);
      setTimeout(() => {
        setSuccessUnbook(false);
      }, 3000);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setOpenCircularProgress(false);
      setWarningUnbookingClass(true);
      setTimeout(() => {
        setWarningUnbookingClass(false);
      }, 3000);
    }
  };

  const fetchClasses = async () => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_classes', {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
    });
      if (!response.ok) {
        throw new Error('Error al obtener las clases: ' + response.statusText);
      }
      const data = await response.json();
      const filteredClasses = data.filter(event => event.BookedUsers.includes(userMail));
      setClasses(filteredClasses);
      setTimeout(() => {
        setOpenCircularProgress(false);
      }, 2000);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setOpenCircularProgress(false);
      setWarningFetchingClasses(true);
      setTimeout(() => {
        setWarningFetchingClasses(false);
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
    if(type==='client'){
        fetchClasses();
    }
  }, [type])

  useEffect(() => {
    if(isSmallScreen400 || isSmallScreen500) {
      setRowsPerPage(10);
    } else {
      setRowsPerPage(5)
    }
    if(isMobileScreen) {
      setMaxHeight('700px');
    } else {
      setMaxHeight('600px')
    }
  }, [isSmallScreen400, isSmallScreen500, isMobileScreen])

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
        if(data.type!='client'){
          navigate('/');
        }
        setOpenCircularProgress(false);
    } catch (error) {
        console.error("Error fetching user:", error);
    }
  };

  const visibleRows = React.useMemo(
    () =>
      [...classes]
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
    [order, orderBy, page, rowsPerPage, classes]
  );

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
                    {!isSmallScreen500 && (
                      <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', fontWeight: 'bold', color: '#54311a' }}>
                        <TableSortLabel
                          active={orderBy === 'hour'}
                          direction={orderBy === 'hour' ? order : 'asc'}
                          onClick={(event) => handleRequestSort(event, 'hour')}
                        >
                          Start time
                          {orderBy === 'hour' && (
                            <Box component="span" sx={visuallyHidden}>
                              {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </Box>
                          )}
                        </TableSortLabel>
                      </TableCell>
                    )}
                    {!isSmallScreen400 && (
                      <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', fontWeight: 'bold', color: '#54311a' }}>
                        <TableSortLabel
                          active={orderBy === 'dateInicio'}
                          direction={orderBy === 'dateInicio' ? order : 'asc'}
                          onClick={(event) => handleRequestSort(event, 'dateInicio')}
                        >
                          Date
                          {orderBy === 'dateInicio' && (
                            <Box component="span" sx={visuallyHidden}>
                              {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </Box>
                          )}
                        </TableSortLabel>
                      </TableCell>
                    )}
                    {!isSmallScreen600 && (
                      <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25', fontWeight: 'bold', color: '#54311a' }}>
                        <TableSortLabel
                          active={orderBy === 'permanent'}
                          direction={orderBy === 'permanent' ? order : 'asc'}
                          onClick={(event) => handleRequestSort(event, 'permanent')}
                        >
                          Recurrent
                          {orderBy === 'permanent' && (
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
                  {visibleRows.length===0 ? (
                      <TableRow>
                      <TableCell colSpan={isSmallScreen500 ? 2 : 4} align="center" sx={{ color: '#54311a', borderBottom: '1px solid #BC6C25' }}>
                          There are no booked classes
                      </TableCell>
                      </TableRow>
                  ) : (
                    <>
                      {visibleRows.map((row) => (
                          <TableRow onClick={() => handleSelectEvent(row)} hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer', borderBottom: '1px solid #BC6C25' }}>
                          <TableCell component="th" scope="row" sx={{ borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25', color:'#54311a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>
                              {row.name}
                          </TableCell>
                          {!isSmallScreen500 && (
                              <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', color: '#54311a' }}>{row.hour}</TableCell>
                          )}
                          {!isSmallScreen400 && (
                              <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', color: '#54311a' }}>{new Date(row.dateInicio).toLocaleDateString()}</TableCell>
                          )}
                          {!isSmallScreen600 && (
                              <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25', color: '#54311a' }}>{row.permanent === 'Si' ? 'Sí' : 'No'}</TableCell>
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
                {isSmallScreen500 ? (
                  <TablePagination
                      rowsPerPageOptions={[10]}
                      component="div"
                      count={classes.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                  />
                  ) : (
                  <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={classes.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                )}
              </>
            ) : (
              null
            )}
          </Paper>
        </Box>
      </div>
      {selectedEvent && (
        <div className="Modal" onClick={handleCloseModal}>
          <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
            <h2>Classes details:</h2>
            <p><strong>Name:</strong> {selectedEvent.name}</p>
            <p>
              <strong>Start time:</strong> 
              {(() => {
                const startTime = new Date(selectedEvent.dateInicio);
                startTime.setHours(startTime.getHours() + 3);
                return startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
              })()}
            </p>
            <p>
              <strong>End time:</strong> 
              {(() => {
                const endTime = new Date(selectedEvent.dateFin);
                endTime.setHours(endTime.getHours() + 3);
                return endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
              })()}
            </p>
            <p><strong>Recurrent:</strong> {selectedEvent.permanent === 'Si' ? 'Yes' : 'No'}</p>
            <p><strong>Participants:</strong> {selectedEvent.BookedUsers.length}/{selectedEvent.capacity}</p>
            <button onClick={() => handleUnbookClass(selectedEvent.id)}>Unbook</button>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
      {openCircularProgress && (
        <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={openCircularProgress}>
          <CircularProgress color="inherit" />
        </Backdrop>
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
      {successUnbook && (
        <div className='alert-container'>
          <div className='alert-content'>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Slide direction="up" in={successUnbook} mountOnEnter unmountOnExit>
                <Alert style={{ fontSize: '100%', fontWeight: 'bold' }} icon={<CheckIcon fontSize="inherit" />} severity="success">
                  Successfully Unbooked!
                </Alert>
              </Slide>
            </Box>
          </div>
        </div>
      )}
      {warningFetchingClasses && (
        <div className='alert-container'>
          <div className='alert-content'>
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
      {warningUnbookingClass && (
        <div className='alert-container'>
          <div className='alert-content'>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Slide direction="up" in={warningUnbookingClass} mountOnEnter unmountOnExit>
                <Alert style={{ fontSize: '100%', fontWeight: 'bold' }} severity="info">
                  Error unbooking class. Try again!
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

export default UsserClasses;
