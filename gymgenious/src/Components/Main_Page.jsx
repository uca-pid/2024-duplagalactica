import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EnhancedTable from '../real_components/TableClasses.jsx';
import { useMediaQuery } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import NewLeftBar from '../real_components/NewLeftBar.jsx';
import {jwtDecode} from "jwt-decode";
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import CheckIcon from '@mui/icons-material/Check';

const localizer = momentLocalizer(moment);

const Calendar = ({ events, onSelectEvent }) => {
  const eventStyleGetter = (event) => {
    const backgroundColor = '#fca311'; 
    const style = {
      backgroundColor: backgroundColor,
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
      display: 'block',
      padding: '5px',
      border: 'none',
    };
    return {
      style: style
    };
  };
  return (
    <div className="Calendar-Container">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        className='calendar-content'
        views={['month', 'day']}
        onSelectEvent={onSelectEvent}
        eventPropGetter={eventStyleGetter}
        formats={{
          timeGutterFormat: (date, culture, localizer) =>
            localizer.format(date, 'HH:mm', culture),
          eventTimeRangeFormat: (date, culture, localizer) => {
            const startTime = new Date(date.start).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            });
            const endTime = new Date(date.end).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            });
            return `${startTime} - ${endTime}`;
          },
        }}
      />
    </div>
  );
};


export default function Main_Page() {
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const [leftBarOption, setLeftBarOption] = React.useState('');
  const isSmallScreen = useMediaQuery('(max-width:250px)');
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [userMail,setUserMail] = useState(null);
  const [warningBookingClass,setWarningBookingClass] = useState(false);
  const [warningUnbookingClass,setWarningUnbookingClass] = useState(false);
  const [warningFetchingClass,setWarningFetchingClass] = useState(false); 
  const [errorToken,setErrorToken] = useState(false);
  const [successBook,setSuccessBook] = useState(false);
  const [successUnbook,setSuccessUnbook] = useState(false);

  const changeShowCalendar = () => {
    setShowCalendar(prevState => !prevState);
    handleCloseModal()
  };


  const handleBookClass = async (event) => {
    setOpenCircularProgress(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/book_class', {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ event: event,mail:userMail })
      });
      if (!response.ok) {
        throw new Error('Error al actualizar la clase: ' + response.statusText);
      }
      await fetchClasses();
      setOpenCircularProgress(false);
      handleCloseModal();
      setSuccessBook(true)
      setTimeout(() => {
        setSuccessBook(false);
      }, 3000);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setOpenCircularProgress(false);
      setWarningBookingClass(true);
      setTimeout(() => {
        setWarningBookingClass(false);
      }, 3000);
    }
    
  };

  const handleUnbookClass = async (event) => {
    setOpenCircularProgress(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/unbook_class', {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ event: event,mail:userMail })
      });
      if (!response.ok) {
        throw new Error('Error al actualizar la clase: ' + response.statusText);
      }
      await fetchClasses();
      setOpenCircularProgress(false);
      handleCloseModal();
      setSuccessUnbook(true);
      setTimeout(() => {
        setSuccessUnbook(false);
      }, 3000);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setOpenCircularProgress(false);
      setWarningUnbookingClass(true);
      setTimeout(() => {
        setWarningUnbookingClass(false);
      }, 3000);
    }
  };

  const fetchClasses = async () => {
    setOpenCircularProgress(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/get_classes');
      if (!response.ok) {
        throw new Error('Error al obtener las clases: ' + response.statusText);
      }
      const data = await response.json();
      console.log(data);
      setClasses(data);
      const calendarEvents = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
    
      data.forEach(clase => {
        const startDate = new Date(clase.dateInicio);
        const CorrectStarDate = new Date(startDate.getTime() + 60 * 3 * 60 * 1000); 
        const endDate = new Date(clase.dateFin);
        const CorrectEndDate = new Date(endDate.getTime() + 60 * 3 * 60 * 1000);
    
        if (clase.permanent === "Si") {
          let nextStartDate = new Date(CorrectStarDate);
          let nextEndDate = new Date(CorrectEndDate);
    
          if (nextStartDate < today) {
            const dayOfWeek = CorrectStarDate.getDay(); 
            let daysUntilNextClass = (dayOfWeek - today.getDay() + 7) % 7;
            if (daysUntilNextClass === 0 && today > CorrectStarDate) {
              daysUntilNextClass = 7;
            }
            nextStartDate.setDate(today.getDate() + daysUntilNextClass);
            nextEndDate = new Date(nextStartDate.getTime() + (CorrectEndDate.getTime() - CorrectStarDate.getTime()));
          }
    
          for (let i = 0; i < 4; i++) {
            calendarEvents.push({
              title: clase.name,
              start: new Date(nextStartDate),
              end: new Date(nextEndDate),
              allDay: false,
              ...clase,
            });
            nextStartDate.setDate(nextStartDate.getDate() + 7);
            nextEndDate.setDate(nextEndDate.getDate() + 7);
          }
        } else {
          calendarEvents.push({
            title: clase.name,
            start: new Date(CorrectStarDate),
            end: new Date(CorrectEndDate),
            allDay: false,
            ...clase,
          });
        }
      });
      setOpenCircularProgress(false);
      setEvents(calendarEvents);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setOpenCircularProgress(false);
      setWarningFetchingClass(true);
      setTimeout(() => {
        setWarningFetchingClass(false);
      }, 3000);
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
    console.log('Token:', token);
    if (token) {
        verifyToken(token);
    } else {
        console.error('No token found');
    }
    fetchClasses();
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };
  
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

      {!isSmallScreen ? (
      <>
        <div className="Calendar-Button">
          {showCalendar ? (
            <button onClick={changeShowCalendar} className="Toggle-Button">
              Show table
            </button>
          ) : (
            <button onClick={changeShowCalendar} className="Toggle-Button">
              Show calendar
            </button>
          )}
        </div>
        {showCalendar ? (
        <div className="WebApp-Body">
          <Calendar events={events} onSelectEvent={handleSelectEvent} />
        </div>
        ) : (
        <div className="Table-Container">
          <EnhancedTable rows={classes} user={leftBarOption} />
        </div>
      )}
      </>
  ) : (
    <div className="Table-Container">
          <EnhancedTable rows={classes} />
    </div>
  )}
  { successBook ? (
      <div className='alert-container'>
      <div className='alert-content'>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Slide direction="up" in={successBook} mountOnEnter unmountOnExit >
              <Alert style={{fontSize:'100%', fontWeight:'bold'}} icon={<CheckIcon fontSize="inherit" /> } severity="success">
                  Successfully Booked!
              </Alert>
          </Slide>
          </Box>
      </div>
      </div>
  ) : (
      null
  )}
  { successUnbook ? (
      <div className='alert-container'>
      <div className='alert-content'>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Slide direction="up" in={successUnbook} mountOnEnter unmountOnExit >
              <Alert style={{fontSize:'100%', fontWeight:'bold'}} icon={<CheckIcon fontSize="inherit" /> } severity="success">
                  Successfully Unbooked!
              </Alert>
          </Slide>
          </Box>
      </div>
      </div>
  ) : (
      null
  )}
  { warningFetchingClass ? (
      <div className='alert-container'>
          <div className='alert-content'>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Slide direction="up" in={warningFetchingClass} mountOnEnter unmountOnExit >
                  <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                      Error fetching classes. Try again!
                  </Alert>
              </Slide>
              </Box>
          </div>
      </div>
  ) : (
      null
  )}
    { warningBookingClass ? (
      <div className='alert-container'>
          <div className='alert-content'>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Slide direction="up" in={warningBookingClass} mountOnEnter unmountOnExit >
                  <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                      Error booking class. Try again!
                  </Alert>
              </Slide>
              </Box>
          </div>
      </div>
  ) : (
      null
  )}
    { warningUnbookingClass ? (
      <div className='alert-container'>
          <div className='alert-content'>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Slide direction="up" in={warningUnbookingClass} mountOnEnter unmountOnExit >
                  <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                      Error unbooking class. Try again!
                  </Alert>
              </Slide>
              </Box>
          </div>
      </div>
  ) : (
      null
  )}
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
  {selectedEvent && (
    <div className="Modal" onClick={handleCloseModal}>
      <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
        <h2>Classes details:</h2>
        <p><strong>Name:</strong> {selectedEvent.name}</p>
        <p><strong>Date:</strong> {new Date(selectedEvent.start).toLocaleDateString()}</p>
        <p><strong>Start time:</strong> {new Date(selectedEvent.start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
        <p><strong>Recurrent:</strong> {selectedEvent.permanent==='Si' ? 'Yes' : 'No'}</p>
        <p><strong>Participants:</strong> 5/20</p>
        {userMail? (
          <>
          {selectedEvent.BookedUsers && selectedEvent.BookedUsers.includes(userMail)  ? (
                <button onClick={() => handleUnbookClass(selectedEvent.name)}>Unbook</button>
              ) : (
                <button onClick={() => handleBookClass(selectedEvent.name)}>Book</button>
          )}
          <button onClick={handleCloseModal}>Close</button>
          </>) : (
          <button onClick={handleCloseModal}>Close</button>
        )}
      </div>
    </div>
  )}
    </div>
  );
}
