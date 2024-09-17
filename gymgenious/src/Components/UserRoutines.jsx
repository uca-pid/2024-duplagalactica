import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import NewLeftBar from '../real_components/NewLeftBar.jsx'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

function ColorToggleButton() {
  const [alignment, setAlignment] = React.useState('web');

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
    >
      <ToggleButton style={{backgroundColor:'#c29d61'}} value="Sunday">Sunday</ToggleButton>
      <ToggleButton style={{backgroundColor:'#c29d61'}} value="Monday">Monday</ToggleButton>
      <ToggleButton style={{backgroundColor:'#c29d61'}} value="Thursday">Tuesday</ToggleButton>
      <ToggleButton style={{backgroundColor:'#c29d61'}} value="Wednesday">Wednesday</ToggleButton>
      <ToggleButton style={{backgroundColor:'#c29d61'}} value="Thuesday">Thursday</ToggleButton>
      <ToggleButton style={{backgroundColor:'#c29d61'}} value="Friday">Friday</ToggleButton>
      <ToggleButton style={{backgroundColor:'#c29d61'}} value="Saturday">Saturday</ToggleButton>
    </ToggleButtonGroup>
  );
}

const columns = [
  { id: 'name', label: 'Name' },
  { id: 'series', label: 'Series'},
  {
    id: 'reps',
    label: 'Reps',
    // minWidth: 170,
    // align: 'right',
    // format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'time',
    label: 'Time',
    // format: (value) => value.toFixed(2),
  },
];

function createData(name, series, reps, time) {
  return { name, series, reps, time };
}

const rows = [
  createData('Exercise 1', 'x4', '12-12-10-10', '90"'),
  createData('Exercise 2', 'x4', '12-10-8-6', '60"'),
  createData('Exercise 3', 'x4', 'failure', '30"'),
];

export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="App">
      <NewLeftBar/>
      <div className="Table-Container">
            <ColorToggleButton/>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                    {columns.map((column) => (
                        <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                        >
                        {column.label}
                        </TableCell>
                    ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                        return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                            {columns.map((column) => {
                            const value = row[column.id];
                            return (
                                <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === 'number'
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                            );
                            })}
                        </TableRow>
                        );
                    })}
                </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
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