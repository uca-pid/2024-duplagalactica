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

function UsserClasses() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const urlParams = new URLSearchParams(window.location.search);
  const userMail = urlParams.get('mail');
  const isSmallScreen = useMediaQuery('(max-width:500px)');
  const isSmallScreen250 = useMediaQuery('(max-width:250px)');

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
                    <button style={{color:'red'}} onClick={handleCloseModal}>Unbook class</button>
                    <button onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
                )}
            </Box>
        </div>
    </div>
  );
  
  
}

// UsserClasses.propTypes = {
//   rows: PropTypes.array.isRequired,
// };

export default UsserClasses;
