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
import { jwtDecode } from "jwt-decode";
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
    const [userMail, setUserMail] = useState('');
    const [visibleRows, setVisibleRows] = useState([]);
    const [routine, setRoutines] = useState([]);
    const [selectedDay, setSelectedDay] = useState('');
    const isSmallScreen = useMediaQuery('(max-width:500px)');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [viewExercises, setViewExercises] = useState(false);
    const [rows, setRows] = useState([]);
    const [errorToken, setErrorToken] = useState(false);
    const [openCircularProgress, setOpenCircularProgress] = useState(false);

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
        fetchRoutineWithExercises(event.routine);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
        setViewExercises(false);
    };

    const handleViewExercises = () => {
        setViewExercises(!viewExercises);
    };

    const fetchRoutines = async () => {
        setOpenCircularProgress(true);
        try {
            const response = await fetch('http://127.0.0.1:5000/get_assigned_routines');
            if (!response.ok) {
                throw new Error('Error al obtener las rutinas: ' + response.statusText);
            }
            const data = await response.json();
            const filteredRows = data.filter((row) =>
                row.user.some((u) => u.Mail === userMail)
            );
            setRows(filteredRows);
            setVisibleRows(filteredRows);
        } catch (error) {
            console.error("Error fetching classes:", error);
        } finally {
            setOpenCircularProgress(false);
        }
    };

    const fetchRoutineWithExercises = async (routineName) => {
        setOpenCircularProgress(true);
        try {
            const response = await fetch('http://127.0.0.1:5000/get_routines');
            if (!response.ok) {
                throw new Error('Error al obtener las rutinas: ' + response.statusText);
            }
            const data = await response.json();
            const filteredRows = data.filter((row) => row.name === routineName);
            setRoutines(filteredRows);
        } catch (error) {
            console.error("Error fetching exercises:", error);
        } finally {
            setOpenCircularProgress(false);
        }
    };

    const verifyToken = async (token) => {
        setOpenCircularProgress(true);
        try {
            const decodedToken = jwtDecode(token);
            setUserMail(decodedToken.email);
        } catch (error) {
            console.error('Error al verificar el token:', error);
            setErrorToken(true);
            setTimeout(() => {
                setErrorToken(false);
            }, 3000);
        } finally {
            setOpenCircularProgress(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            verifyToken(token);
        } else {
            console.error('No token found');
        }
        fetchRoutines();
    }, [userMail]);

    useEffect(() => {
        if (selectedDay) {
            const filteredRows = rows.filter((row) => row.day === selectedDay);
            setVisibleRows(filteredRows);
        } else {
            setVisibleRows(rows);
        }
    }, [rows, selectedDay]);

    return (
        <div className="App">
            <NewLeftBar />
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
                                {visibleRows.map((row) => (
                                    <TableRow onClick={() => handleSelectEvent(row)} hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer', borderBottom: '1px solid #ccc' }}>
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
                                                {row.excercises ? row.excercises.length : 0}
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
                        <p><strong>Exercises:</strong> {selectedEvent.excercises ? selectedEvent.excercises.length : 0}</p>
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
                                        {routine[0]?.excercises?.map((exercise) => (
                                            <TableRow key={exercise.id}>
                                                <TableCell>{exercise.name}</TableCell>
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
