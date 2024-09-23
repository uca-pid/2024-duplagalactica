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
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useState, useEffect } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import NewLeftBar from '../real_components/NewLeftBar';

function ColorToggleButton({ selectedDay, setSelectedDay }) {
  const [hovered, setHovered] = useState(null);

  const handleMouseEnter = (value) => {
    setHovered(value);
  };

  const handleMouseLeave = () => {
    setHovered(null);
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={selectedDay}
      exclusive
      onChange={(event, newDay) => setSelectedDay(newDay)}
      aria-label="Platform"
    >
      {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
        <ToggleButton
          key={day}
          style={{
            backgroundColor: selectedDay === day || hovered === day ? '#5e2404' : '#b87d48',
            color: 'white',
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
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [visibleRows, setVisibleRows] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const isSmallScreen = useMediaQuery('(max-width:500px)');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewExercises, setViewExercises] = useState(false);

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
  
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const handleViewExercises = () => {
    setViewExercises(!viewExercises);
  };

  const staticRows = [
    {
      id: 1,
      routine: 'routine 1',
      description: 'akdalnfkwaklfaf',
      excercises: ['exercise 1', 'exercise 2', 'exercise 3'],
      day: 'Monday',
      owner: 'isoldi772@gmail.com',
    },
    {
      id: 2,
      routine: 'routine 2',
      description: 'awaff',
      excercises: ['exercise 1', 'exercise 2', 'exercise 3', 'exercise 4'],
      day: 'Tuesday',
      owner: 'manolo@gmail.com',
    },
    {
      id: 3,
      routine: 'routine 3',
      description: 'awaff',
      excercises: ['exercise 1', 'exercise 2'],
      day: 'Tuesday',
      owner: 'juanls@gmail.com',
    },
  ];

  const staticExercises = [
    {
      id: 1,
      exercise: 'exercise 1',
      description: 'akdalnfkwaklfaf',
      owner: 'isoldi772@gmail.com',
      series: 4,
      reps: [12,12,10,10],
      timing: '90"'
    },
    {
      id: 2,
      exercise: 'exercise 2',
      description: 'adaffa',
      owner: 'isoldi772@gmail.com',
      series: 4,
      reps: [10,10,8,8],
      timing: '90"'
    },
  ];

  useEffect(() => {
    if (selectedDay) {
      const filteredRows = staticRows.filter((row) => row.day === selectedDay);
      setVisibleRows(filteredRows);
    } else {
      setVisibleRows(staticRows);
    }
  }, [selectedDay]);

  return (
    <div className="App">
      <NewLeftBar/>
      <div className="Table-Container">
        <ColorToggleButton selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
        <Paper sx={{ width: '100%', overflow: 'hidden', border: '2px solid #BC6C25' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow sx={{ height: '5vh', color: '#54311a' }}>
                  <TableCell
                    sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', fontWeight: 'bold' }}
                  >
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
                    <TableCell
                      align="right"
                      sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', fontWeight: 'bold', color: '#54311a' }}
                    >
                      Day
                    </TableCell>
                  )}
                  {!isSmallScreen && (
                    <TableCell
                      align="right"
                      sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', fontWeight: 'bold', color: '#54311a' }}
                    >
                      Exercises
                    </TableCell>
                  )}
                  {!isSmallScreen && (
                    <TableCell
                      align="right"
                      sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', fontWeight: 'bold', color: '#54311a' }}
                    >
                      Teacher
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.map((row, index) => (
                  <TableRow onClick={()=>handleSelectEvent(row)} hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer', borderBottom: '1px solid #ccc' }}>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', color: '#54311a' }}
                    >
                      {row.routine}
                    </TableCell>
                    {!isSmallScreen && (
                      <TableCell
                        align="right"
                        sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', color: '#54311a' }}
                      >
                        {row.day}
                      </TableCell>
                    )}
                    {!isSmallScreen && (
                      <TableCell
                        align="right"
                        sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', color: '#54311a' }}
                      >
                        {row.excercises.length}
                      </TableCell>
                    )}
                    {!isSmallScreen && (
                      <TableCell
                        align="right"
                        sx={{ borderBottom: '1px solid #BC6C25', borderRight: '1px solid #BC6C25', color: '#54311a' }}
                      >
                        {row.owner}
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
      </div>
      {selectedEvent && (
        <div className="Modal" onClick={handleCloseModal}>
            <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
            <h2>Routine details</h2>
            <p><strong>Name:</strong> {selectedEvent.routine}</p>
            <p><strong>Description:</strong> {selectedEvent.description}</p>
            <p><strong>Day:</strong> {selectedEvent.day}</p>
            <p><strong>Exercises:</strong> {selectedEvent.excercises.length}</p>
            <p><strong>Teacher:</strong> {selectedEvent.owner}</p>
            <button onClick={handleViewExercises}>View exercises</button>
            <button onClick={handleCloseModal}>Close</button>
            </div>
        </div>
        )}
        {viewExercises && (
        <div className="Modal" onClick={handleViewExercises}>
            <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
              <h2>Exercises from {selectedEvent.routine}</h2>
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Exercise</TableCell>
                        <TableCell>Series</TableCell>
                        <TableCell>Reps</TableCell>
                        <TableCell>Timing</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {staticExercises
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((exercise) => (
                          <TableRow key={exercise.id}>
                            <TableCell>{exercise.exercise}</TableCell>
                            <TableCell>{exercise.series} x</TableCell>
                            <TableCell>{exercise.reps.join(', ')}</TableCell>
                            <TableCell>{exercise.timing}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
              <button onClick={handleViewExercises}>Close</button>
            </div>
        </div>
        )}
    </div>
  );
}
