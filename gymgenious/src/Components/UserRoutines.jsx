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
import NewLeftBar from '../real_components/NewLeftBar.jsx'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {useState, useEffect} from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import {jwtDecode} from "jwt-decode";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

function ColorToggleButton() {
  const [alignment, setAlignment] = React.useState('web');
  const [hovered, setHovered] = useState(null);
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const handleMouseEnter = (value) => {
      setHovered(value);
  };

  const handleMouseLeave = () => {
      setHovered(null);
  };

  return (
    <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
        >
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                <ToggleButton 
                    key={day}
                    style={{ 
                        backgroundColor: 
                            alignment === day || hovered === day 
                                ? '#5e2404' 
                                : '#b87d48', 
                        color: 'white' 
                    }} 
                    value={day}
                    onMouseEnter={() => handleMouseEnter(day)}
                    onMouseLeave={handleMouseLeave}
                >
                    {day}
                </ToggleButton>
            ))}
    </ToggleButtonGroup>
  );
}





export default function StickyHeadTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userMail, setUserMail] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [visibleRows, setVisibleRows] = useState([]);
  const isSmallScreen = useMediaQuery('(max-width:500px)');
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [errorToken,setErrorToken] = useState(false);

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

  const fetchRoutines = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/get_assigned_routines');
      if (!response.ok) {
        throw new Error('Error al obtener las clases: ' + response.statusText);
      }
      const data = await response.json();
      const filteredRoutines = data.filter(event =>
        event.user.some(user => user.Mail === userMail)
      );
      setVisibleRows(filteredRoutines);
    } catch (error) {
      console.error("Error fetching rutinas:", error);
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
      console.error('No token found');
    }
  }, []);

  useEffect(() => {
    if (userMail) {
      fetchRoutines(); // Llama a fetchRoutines cuando userMail cambie
    }
  }, [userMail]);

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
        <ColorToggleButton/>
        <Paper sx={{ width: '100%', overflow: 'hidden', border: '2px solid #BC6C25' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow sx={{ height: '5vh', color: '#54311a' }}>
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
                  {!isSmallScreen && (
                    <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', fontWeight: 'bold', color: '#54311a' }}>
                      <TableSortLabel
                        active={orderBy === 'hour'}
                        direction={orderBy === 'hour' ? order : 'asc'}
                        onClick={(event) => handleRequestSort(event, 'hour')}
                      >
                        Teacher
                        {orderBy === 'hour' ? (
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
                {visibleRows.map((row) => (
                  <TableRow key={row.id} hover tabIndex={-1} sx={{ cursor: 'pointer', borderBottom: '1px solid #ccc' }}>
                    <TableCell component="th" scope="row" sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', color: '#54311a' }}>
                      {row.routine}
                    </TableCell>
                    {!isSmallScreen && (
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
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={visibleRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </div>
  );
}
