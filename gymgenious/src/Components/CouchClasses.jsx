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
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editClass, setEditClass] = useState(false);
  const [userMail,setUserMail] = useState(null)
  const isSmallScreen = useMediaQuery('(max-width:500px)');
  const isSmallScreen250 = useMediaQuery('(max-width:250px)');
  const [classes,setClasses]=useState([])
  const [hour, setHour] = useState('');
  const [hourFin, setHourFin] = useState('');
  const [permanent, setPermanent] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [warningConnection, setWarningConnection] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const isMobileScreen = useMediaQuery('(min-height:750px)');
  const [maxHeight, setMaxHeight] = useState('600px');
  const [type, setType] = useState(null);

  const day = (dateString) => {
    const date = new Date(dateString);
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return daysOfWeek[date.getDay()];
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
  const handleEditClass = () => {
    setEditClass(!editClass);
    setHour(selectedEvent.hour);
    setHourFin('');
    setPermanent('');
    setDate('');
    setName('');
  } 
  const fetchModifyClassInformation = async (selectedEvent) => {
    console.log("toy aca")
    setOpenCircularProgress(true);
    try {
        console.log("ssss",selectedEvent)
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token no disponible en localStorage');
          return;
        }
        const isoDateStringInicio = `${date}T${hour}:00Z`;
        const isoDateStringFin = `${date}T${hourFin}:00Z`;
        const updatedUser = {
            cid: selectedEvent.id,
            NameOriginal: selectedEvent.name,
            DateFin: isoDateStringFin || selectedEvent.dateFin,
            DateInicio: isoDateStringInicio || selectedEvent.dateInicio,
            Day: day(date) || selectedEvent.day,
            Name: name || selectedEvent.name,
            Hour:hour || selectedEvent.hour,
            Permanent: permanent || selectedEvent.permanent
        };
        const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/update_class_info', {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ newUser: updatedUser })
        });

        if (!response.ok) {
            throw new Error('Error al actualizar los datos del usuario: ' + response.statusText);
        }
        const data = await response.json();
        await fetchClasses();
        setOpenCircularProgress(false);
        handleCloseModal(); 
    } catch (error) {
        console.error("Error updating user:", error);
        setOpenCircularProgress(false);
        setWarningConnection(true);
        setTimeout(() => {
            setWarningConnection(false);
        }, 3000);
    }
};

  const handleDeleteClass = async (event) => {
    setOpenCircularProgress(true);
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token no disponible en localStorage');
          return;
        }
      const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/delete_class', {
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ event: event,mail:userMail })
      });
      if (!response.ok) {
        throw new Error('Error al actualizar la clase: ' + response.statusText);
      }
      await fetchClasses();
      setOpenCircularProgress(false);
      handleCloseModal();
    } catch (error) {
      console.error("Error fetching classes:", error);
      setOpenCircularProgress(false);
      setWarningConnection(true);
      setTimeout(() => {
        setWarningConnection(false);
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
      const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_classes');
      if (!response.ok) {
        throw new Error('Error al obtener las clases: ' + response.statusText);
      }
      const data = await response.json();
      const filteredClasses = data.filter(event => event.owner == userMail);
      setClasses(filteredClasses);
      setOpenCircularProgress(false);
    } catch (error) {
      console.error("Error fetching classes:", error);
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
        console.error('No token found');
    }
    if(userMail){
        fetchUser();
    }
  }, [userMail]);


  useEffect(() => {
    if(type==='coach'){
        fetchClasses();
    }
  }, [type])

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
        {type!='coach' ? (
            <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        ) : (
          <>
        <NewLeftBar/>
        {openCircularProgress ? (
            <Backdrop open={openCircularProgress} sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}>
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
                                                Start time
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
                                                Date
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
                                                Recurrent
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
                                        <TableCell component="th" scope="row" sx={{ borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25',color:'#54311a' }}>
                                            {row.name}
                                        </TableCell>
                                        {!isSmallScreen && (
                                            <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25',color:'#54311a' }}>
                                                {row.hour}
                                            </TableCell>
                                        )}
                                        {!isSmallScreen250 && (
                                            <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25',color:'#54311a' }}>
                                                {new Date(row.dateInicio).toLocaleDateString()}
                                            </TableCell>
                                        )}
                                        {!isSmallScreen && (
                                            <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25',color:'#54311a' }}>
                                                {row.permanent === 'Si' ? 'Sí' : 'No'}
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
                </Paper>
                {selectedEvent && (
                    <div className="Modal" onClick={handleCloseModal}>
                        <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
                            <h2>Class details</h2>
                            <p><strong>Name:</strong> {selectedEvent.name}</p>
                            <p><strong>Date:</strong> {new Date(selectedEvent.dateInicio).toLocaleDateString()}</p>
                            <p><strong>Start time:</strong> {selectedEvent.hour}</p>
                            <p><strong>Recurrent:</strong> {selectedEvent.permanent==='Si' ? 'Yes' : 'No'}</p>
                            <p><strong>Participants:</strong> {5}</p>
                            <button onClick={handleEditClass}>Edit class</button>
                            <button onClick={handleCloseModal}>Close</button>
                            <button onClick={() => handleDeleteClass(selectedEvent.id)}>Delete class</button>
                        </div>
                    </div>
                )}
                {editClass && (
                    <div className="Modal" onClick={handleEditClass}>
                        <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
                            <h2>Class details</h2>
                            <form>
                                <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                                    <div className="input-small-container">
                                        <label htmlFor="hour" style={{color:'#14213D'}}>Start time:</label>
                                        <input 
                                        type={selectedEvent.hour ? 'text' : 'time'}
                                        id="hour" 
                                        name="hour" 
                                        value={hour} 
                                        onChange={(e) => setHour(e.target.value)}
                                        onFocus={(e) => (e.target.type = 'time')}
                                        onBlur={(e) => (e.target.type = 'text')}
                                        placeholder={selectedEvent.hour}
                                        />
                                    </div>
                                    <div className="input-small-container">
                                        <label htmlFor="hourFin" style={{color:'#14213D'}}>End time:</label>
                                        <input 
                                            type="time" 
                                            id="hourFin" 
                                            name="hourFin" 
                                            value={hourFin} 
                                            onChange={(e) => setHourFin(e.target.value)} 
                                        />
                                    </div>
                                    <div className="input-small-container">
                                        <label htmlFor="name" style={{color:'#14213D'}}>Name:</label>
                                        <input 
                                        type="text" 
                                        id="name" 
                                        name="name" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder={selectedEvent.name}                                />
                                    </div>
                                </div>
                                <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                                    <div className="input-small-container" style={{width:"100%"}}>
                                        <label htmlFor="permanent" style={{color:'#14213D'}}>Recurrent:</label>
                                        <select 
                                        id="permanent" 
                                        name="permanent" 
                                        value={permanent} 
                                        onChange={(e) => setPermanent(e.target.value)}
                                        placeholder={selectedEvent.permanent}
                                        >
                                            <option value="" >Select</option>
                                            <option value="Si">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>
                                    <div className="input-small-container" style={{ flex: 3, textAlign: 'left' }}>
                                        <label htmlFor="date" style={{color:'#14213D'}}>Date:</label>
                                        <input 
                                            type={date ? 'date' : 'text'}
                                            id='date'
                                            name='date'
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            placeholder={new Date(selectedEvent.dateInicio).toLocaleDateString()}
                                            onFocus={(e) => (e.target.type = 'date')}
                                            onBlur={(e) => (e.target.type = 'text')}
                                        />
                                    </div>
                                </div>
                                <button onClick={handleEditClass} className='button_login'>Cancell</button>
                                <button onClick={fetchModifyClassInformation} type="submit" className='button_login'>Save changes</button>
                            </form>
                        </div>
                    </div>
                )}
            </Box>
        </div>
        </>
        )}
    </div>
    
  );
}

// CouchClasses.propTypes = {
//   rows: PropTypes.array.isRequired,
// };

export default CouchClasses;