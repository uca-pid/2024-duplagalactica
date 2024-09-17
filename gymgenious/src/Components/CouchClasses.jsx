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

  const [hour, setHour] = useState('');
  const [hourFin, setHourFin] = useState('');
  const [permanent, setPermanent] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const userType = urlParams.get('type');
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

  const handleCreateClass = async () => {
    const format= "HH:mm";
    const realHourEnd = moment(hourFin, format).subtract(30, 'minutes').format(format);
    try {
      if(moment(realHourEnd, format).isBefore(moment(hour, format))){
        throw new Error('La clase debe durar al menos 30 minutos');
      }
  
      const isoDateStringInicio = `${date}T${hour}:00Z`;
      const isoDateStringFin = `${date}T${hourFin}:00Z`;
  
      const newClass = {
        name: name,
        dateInicio: isoDateStringInicio,
        dateFin: isoDateStringFin,
        hour: hour,
        day: day(date),
        permanent: permanent,
        owner: userMail
      };
  
      const response = await fetch('http://127.0.0.1:5000/create_class', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClass),
      });
  
      if (!response.ok) {
        throw new Error('Error al crear la clase');
      }
  
    } catch (error) {
      console.error("Error al crear la clase:", error);
      if(moment(realHourEnd, format).isBefore(moment(hour, format))){
        alert('La clase debe durar al menos 30 minutos');
      } else if (name=='') {
      alert("Ingrese un nombre para la clase");
     } else if (permanent=='') {
      alert("Ingrese si la clase es recurrente o no");
     } else if (date=='') {
      alert("Ingrese la fecha de la clase");
     } else {
      alert("Error al crear la clase");
     }
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateClass();
  };

//   const visibleRows = React.useMemo(
//     () =>
//       [...rows]
//         .sort((a, b) =>
//           order === 'asc'
//             ? a[orderBy] < b[orderBy]
//               ? -1
//               : 1
//             : a[orderBy] > b[orderBy]
//             ? -1
//             : 1
//         )
//         .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
//     [order, orderBy, page, rowsPerPage, rows]
//   );

const visibleRows = [
    { 
      id: 1, 
      name: 'Clase de Yoga', 
      hour: '10:00 AM', 
      dateInicio: '2024-09-17T10:00:00', 
      permanent: 'Si' 
    },
    { 
      id: 2, 
      name: 'Entrenamiento Funcional', 
      hour: '12:00 PM', 
      dateInicio: '2024-09-18T12:00:00', 
      permanent: 'No' 
    },
    { 
      id: 3, 
      name: 'Pilates', 
      hour: '02:00 PM', 
      dateInicio: '2024-09-19T14:00:00', 
      permanent: 'No' 
    },
    { 
      id: 4, 
      name: 'CrossFit', 
      hour: '06:00 PM', 
      dateInicio: '2024-09-20T18:00:00', 
      permanent: 'Si' 
    },
    { 
      id: 5, 
      name: 'Zumba', 
      hour: '08:00 AM', 
      dateInicio: '2024-09-21T08:00:00', 
      permanent: 'No' 
    }
  ]; //ES UNA TABLA RANDOM, HAY QUE CAMBIAR POR LAS CLASES QUE ESTA ANOTADO EL USUARIO
  

  return (
    <div className="App">
        <NewLeftBar/>
        <div className="Table-Container">
            <Box sx={{ width: '100%', flexWrap: 'wrap' }}>
            <Paper 
                sx={{ 
                width: '100%', 
                mb: 2, 
                backgroundColor: '#E5E5E5',
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
                    <TableRow sx={{ borderBottom: '1px solid #ccc', height: '5vh',width:'5vh' }}>
                        <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold' }}>
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
                        <TableCell align="right" sx={{ border: '1px solid #ccc', fontWeight: 'bold' }}>
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
                        <TableCell align="right" sx={{ border: '1px solid #ccc', fontWeight: 'bold' }}>
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
                        <TableCell align="right" sx={{ border: '1px solid #ccc', fontWeight: 'bold' }}>
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
                        <TableCell component="th" scope="row" sx={{ border: '1px solid #ccc' }}>
                            {row.name}
                        </TableCell>
                        {!isSmallScreen && (
                            <TableCell align="right" sx={{ border: '1px solid #ccc' }}>{row.hour}</TableCell>
                        )}
                        {!isSmallScreen250 && (
                            <TableCell align="right" sx={{ border: '1px solid #ccc' }}>{new Date(row.dateInicio).toLocaleDateString()}</TableCell>
                        )}
                        {!isSmallScreen && (
                            <TableCell align="right" sx={{ border: '1px solid #ccc' }}>{row.permanent === 'Si' ? 'Sí' : 'No'}</TableCell>
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
                        <button onClick={handleEditClass} type="submit" className='button_login'>
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
