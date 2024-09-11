import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
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

function EnhancedTable({ rows }) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, backgroundColor: '#E5E5E5' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table sx={{ width: '100%', borderCollapse: 'collapse' }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
            <TableHead>
              <TableRow sx={{ borderBottom: '1px solid #ccc' }}>
                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold' }}>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, 'name')}
                  >
                    Nombre
                    {orderBy === 'name' ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" sx={{ border: '1px solid #ccc', fontWeight: 'bold' }}>
                  <TableSortLabel
                    active={orderBy === 'hour'}
                    direction={orderBy === 'hour' ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, 'hour')}
                  >
                    Hora
                    {orderBy === 'hour' ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" sx={{ border: '1px solid #ccc', fontWeight: 'bold' }}>
                  <TableSortLabel
                    active={orderBy === 'dateInicio'}
                    direction={orderBy === 'dateInicio' ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, 'dateInicio')}
                  >
                    Fecha
                    {orderBy === 'dateInicio' ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" sx={{ border: '1px solid #ccc', fontWeight: 'bold' }}>
                  <TableSortLabel
                    active={orderBy === 'permanent'}
                    direction={orderBy === 'permanent' ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, 'permanent')}
                  >
                    Todas las semanas
                    {orderBy === 'permanent' ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row) => (
                <TableRow hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer', borderBottom: '1px solid #ccc' }}>
                  <TableCell component="th" scope="row" sx={{ border: '1px solid #ccc' }}>
                    {row.name}
                  </TableCell>
                  <TableCell align="right" sx={{ border: '1px solid #ccc' }}>{row.hour}</TableCell>
                  <TableCell align="right" sx={{ border: '1px solid #ccc' }}>{new Date(row.dateInicio).toLocaleDateString()}</TableCell>
                  <TableCell align="right" sx={{ border: '1px solid #ccc' }}>{row.permanent==='Si' ? 'Sí' : 'No'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
  
}

EnhancedTable.propTypes = {
  rows: PropTypes.array.isRequired,
};

export default EnhancedTable;
