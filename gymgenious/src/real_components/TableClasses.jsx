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

function EnhancedTable({ rows, user }) {
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

  const visibleRows = React.useMemo(
    () =>
      [...rows]
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
    [order, orderBy, page, rowsPerPage, rows]
  );

  return (
    <Box sx={{ width: '100%', flexWrap: 'wrap',background:'#ffe0b5',border: '2px solid #BC6C25',borderRadius:'10px' }}>
      <Paper 
        sx={{ 
          width: '100%', 
          backgroundColor: '#ffe0b5',
          borderRadius:'10px'
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
              <TableRow sx={{height: '5vh',width:'5vh' }}>
                <TableCell sx={{  borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25', fontWeight: 'bold' }}>
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
                  <TableCell align="right" sx={{  borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25' , fontWeight: 'bold',color:'#54311a' }}>
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
                  <TableCell align="right" sx={{ borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25' ,fontWeight: 'bold',color:'#54311a' }}>
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
                  <TableCell align="right" sx={{  borderBottom: '1px solid #BC6C25', fontWeight: 'bold',color:'#54311a' }}>
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
                <TableRow onClick={()=>handleSelectEvent(row)} hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer', borderBottom: '1px solid #BC6C25' }}>
                  <TableCell component="th" scope="row" sx={{  borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25',color:'#54311a'}}>
                    {row.name}
                  </TableCell>
                  {!isSmallScreen && (
                    <TableCell align="right" sx={{  borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25',color:'#54311a'  }}>{row.hour}</TableCell>
                  )}
                  {!isSmallScreen250 && (
                    <TableCell align="right" sx={{  borderBottom: '1px solid #BC6C25',borderRight: '1px solid #BC6C25',color:'#54311a'  }}>{new Date(row.dateInicio).toLocaleDateString()}</TableCell>
                  )}
                  {!isSmallScreen && (
                    <TableCell align="right" sx={{  borderBottom: '1px solid #BC6C25',color:'#54311a'}}>{row.permanent === 'Si' ? 'Sí' : 'No'}</TableCell>
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
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          
        />
      ) : (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
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
            <h2>Classes details:</h2>
            <p><strong>Name:</strong> {selectedEvent.name}</p>
            <p><strong>Date:</strong> {new Date(selectedEvent.start).toLocaleDateString()}</p>
            <p><strong>Start time:</strong> {new Date(selectedEvent.start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
            <p><strong>Recurrent:</strong> {selectedEvent.permanent==='Si' ? 'Yes' : 'No'}</p>
            <p><strong>Participants:</strong> {5}</p>
            {1===1 ? ( //userMail
              <>
              { 1===1 ? ( //si esta inscripto o no
                    <button>Unbook</button>
                  ) : (
                    <button>Book</button>
              )}
              <button onClick={handleCloseModal}>Close</button>
              </>) : (
              <button onClick={handleCloseModal}>Close</button>
            )}
          </div>
        </div>
      )}
    </Box>
  );
  
  
}

EnhancedTable.propTypes = {
  rows: PropTypes.array.isRequired,
};

export default EnhancedTable;
