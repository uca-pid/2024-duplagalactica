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
import moment from 'moment'
import { useNavigate } from 'react-router-dom';
 
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
  const urlParams = new URLSearchParams(window.location.search);
  const userMail = urlParams.get('mail');
  const isSmallScreen = useMediaQuery('(max-width:500px)');
  const isSmallScreen250 = useMediaQuery('(max-width:250px)');
  const [visibleRows,setClasses]=useState([])
  const [hour, setHour] = useState('');
  const [hourFin, setHourFin] = useState('');
  const [permanent, setPermanent] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
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
    setHour('');
    setHourFin('');
    setPermanent('');
    setDate('');
    setName('');
  } 
  const fetchModifyClassInformation = async () => {
    try {
        const isoDateStringInicio = `${date}T${hour}:00Z`;
        const isoDateStringFin = `${date}T${hourFin}:00Z`;
        const updatedUser = {
            NameOriginal: selectedEvent.name,
            DateFin: isoDateStringFin,
            DateInicio: isoDateStringInicio,
            Day: day(date),
            Name: name,
            Permanent: permanent
        };
        const response = await fetch('http://127.0.0.1:5000/update_class_info', {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newUser: updatedUser })
        });

        if (!response.ok) {
            throw new Error('Error al actualizar los datos del usuario: ' + response.statusText);
        }
        const data = await response.json();
        await fetchClasses();
        handleCloseModal(); 
    } catch (error) {
        console.error("Error updating user:", error);
    }
};

  const handleDeleteClass = async (event) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/delete_class', {
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ event: event,mail:userMail })
      });
      if (!response.ok) {
        throw new Error('Error al actualizar la clase: ' + response.statusText);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
    await fetchClasses();
    handleCloseModal();
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/get_classes');
      if (!response.ok) {
        throw new Error('Error al obtener las clases: ' + response.statusText);
      }
      const data = await response.json();
      console.log(data);
      const filteredClasses = data.filter(event => event.owner == userMail);

      setClasses(filteredClasses);

    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="App">
        <NewLeftBar/>
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
                            Start time
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
                            Date
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
                            Recurrent
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
                    {visibleRows.map((row) => (
                        <TableRow onClick={()=>handleSelectEvent(row)} hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer', borderBottom: '1px solid #ccc' }}>
                        <TableCell component="th" scope="row" sx={{ borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25',color:'#54311a' }}>
                            {row.name}
                        </TableCell>
                        {!isSmallScreen && (
                            <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25',color:'#54311a' }}>{row.hour}</TableCell>
                        )}
                        {!isSmallScreen250 && (
                            <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25',color:'#54311a' }}>{new Date(row.dateInicio).toLocaleDateString()}</TableCell>
                        )}
                        {!isSmallScreen && (
                            <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25',color:'#54311a' }}>{row.permanent === 'Si' ? 'Sí' : 'No'}</TableCell>
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
                    <h2>Class details</h2>
                    <p><strong>Name:</strong> {selectedEvent.name}</p>
                    <p><strong>Date:</strong> {new Date(selectedEvent.dateInicio).toLocaleDateString()}</p>
                    <p><strong>Start time:</strong> {selectedEvent.hour}</p>
                    <p><strong>Recurrent:</strong> {selectedEvent.permanent==='Si' ? 'Yes' : 'No'}</p>
                    <button onClick={handleEditClass}>Edit class</button>
                    <button onClick={handleCloseModal}>Close</button>
                    <button onClick={() => handleDeleteClass(selectedEvent.name)}>Delete class</button>
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
                        <button onClick={handleEditClass} className='button_login'>
                            Cancell
                        </button>
                        <button onClick={fetchModifyClassInformation} type="submit" className='button_login'>
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
