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
import NewLeftBar from '../real_components/NewLeftBar';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import {jwtDecode} from "jwt-decode";

function UsserClasses() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userMail, setUserMail] = useState('');
  const [visibleRows, setClasses] = useState([]);
  const isSmallScreen = useMediaQuery('(max-width:500px)');
  const isSmallScreen250 = useMediaQuery('(max-width:250px)');
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [errorToken, setErrorToken] = useState(false);

  // Función para ordenar
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Selección de evento
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  // Cancelar clase
  const handleUnbookClass = async (event) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/unbook_class', {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ event: event, mail: userMail })
      });
      if (!response.ok) {
        throw new Error('Error al actualizar la clase: ' + response.statusText);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
    await fetchClasses();  // Actualizar clases después de cancelar
    handleCloseModal();
  };

  // Obtener clases desde el servidor
  const fetchClasses = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/get_classes');
      if (!response.ok) {
        throw new Error('Error al obtener las clases: ' + response.statusText);
      }
      const data = await response.json();
      const filteredClasses = data.filter(event => event.BookedUsers.includes(userMail));
      
      setClasses(filteredClasses);  // Actualizar el estado con las clases filtradas
      console.log('Clases visibles:', filteredClasses);  // Log para verificar los datos
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  // Verificación del token y obtención del email del usuario
  const verifyToken = async (token) => {
    setOpenCircularProgress(true);
    try {
        const decodedToken = jwtDecode(token);
        setUserMail(decodedToken.email);  // Guardar el correo del usuario
        setOpenCircularProgress(false);
        await fetchClasses();  // Obtener clases después de verificar el token
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

  // Ejecutar cuando el componente se monta
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('Token:', token);
    if (token) {
        verifyToken(token);
    } else {
        console.error('No token found');
    }
  }, [userMail]);  // Añadimos userMail como dependencia para volver a ejecutar cuando cambia

  return (
    <div className="App">
        <NewLeftBar/>
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
        <div className="Table-Container">
            <Box sx={{ width: '100%', flexWrap: 'wrap',background:'#ffe0b5',border: '2px solid #BC6C25',borderRadius:'10px'  }}>
              <Paper sx={{ width: '100%',backgroundColor: '#ffe0b5',borderRadius:'10px' }}>
                <TableContainer>
                  <Table sx={{ width: '100%', borderCollapse: 'collapse' }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
                    <TableHead>
                      <TableRow sx={{ height: '5vh', width: '5vh' }}>
                        <TableCell sx={{ borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25', fontWeight: 'bold' }}>
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
                          <TableCell align="right" sx={{  borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25' , fontWeight: 'bold',color:'#54311a'}}>
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
                        {!isSmallScreen250 && (
                          <TableCell align="right" sx={{   borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25' , fontWeight: 'bold',color:'#54311a' }}>
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
                        {!isSmallScreen && (
                          <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25', fontWeight: 'bold',color:'#54311a' }}>
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
                      {visibleRows.map((row) => (
                        <TableRow onClick={() => handleSelectEvent(row)} hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer', borderBottom: '1px solid #ccc' }}>
                          <TableCell component="th" scope="row" sx={{   borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25',color:'#54311a' }}>
                            {row.name}
                          </TableCell>
                          {!isSmallScreen && (
                            <TableCell align="right" sx={{borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25',color:'#54311a' }}>
                              {row.hour}
                            </TableCell>
                          )}
                          {!isSmallScreen250 && (
                            <TableCell align="right" sx={{borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25',color:'#54311a' }}>
                              {row.dateInicio}
                            </TableCell>
                          )}
                          {!isSmallScreen && (
                            <TableCell align="right" sx={{borderBottom: '1px solid #BC6C25',color:'#54311a'}}>
                              {row.permanent}
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
    </div>
  );
}

export default UsserClasses;
