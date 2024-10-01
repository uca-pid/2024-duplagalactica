import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import NewLeftBar from '../real_components/NewLeftBar.jsx';
import {jwtDecode} from "jwt-decode";
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import CheckIcon from '@mui/icons-material/Check';
import Calendar from '../real_components/Calendar.jsx';
import EnhancedTable from '../real_components/TableClasses.jsx';
import WarningConnectionAlert from '../real_components/WarningConnectionAlert.jsx';
import ErrorTokenAlert from '../real_components/ErrorTokenAlert.jsx';
import SuccessAlert from '../real_components/ErrorTokenAlert.jsx';

export default function Main_Page() {
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const [leftBarOption, setLeftBarOption] = useState('');
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [userMail,setUserMail] = useState(null);
  const [warningConnection, setWarningConnection] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const [successBook,setSuccessBook] = useState(false);
  const [successUnbook,setSuccessUnbook] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:250px)');

  const changeShowCalendar = () => {
    setShowCalendar(prevState => !prevState);
    handleCloseModal()
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const fetchClasses = async () => {
    setOpenCircularProgress(true);
    try {
      const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_classes');
      if (!response.ok) {
        throw new Error('Error al obtener las clases: ' + response.statusText);
      }
      const data = await response.json();
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
      console.log(calendarEvents);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setOpenCircularProgress(false);
      setWarningConnection(true);
      setTimeout(() => {
        setWarningConnection(false);
      }, 3000);
    }
  };

  const handleBookClass = async (event) => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/book_class', {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
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
      setWarningConnection(true);
      setTimeout(() => {
        setWarningConnection(false);
      }, 3000);
    }
    
  };

  const handleUnbookClass = async (event) => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/unbook_class', {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
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
      setWarningConnection(true);
      setTimeout(() => {
        setWarningConnection(false);
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
    let token = localStorage.getItem('authToken');
    if (token) {
        verifyToken(token);
    } else {
        console.error('No token found');
    }
    fetchClasses();
    setClasses([{name:'class1',start:'28/09/2024'}])
  }, []);
  
  return (
    <div className="App">
      <SuccessAlert successAlert={successBook} message={'Successfully Booked!'}/>
      <SuccessAlert successAlert={successUnbook} message={'Successfully Unbooked!'}/>
      <WarningConnectionAlert warningConnection={warningConnection}/>
      <ErrorTokenAlert errorToken={errorToken}/>
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
          <EnhancedTable rows={classes} user={userMail} handleBookClass={handleBookClass} handleUnbookClass={handleUnbookClass}/>
        </div>
      )}
      </>
  ) : (
    <div className="Table-Container">
          <EnhancedTable rows={classes} />
    </div>
  )}
  {selectedEvent && (
    <div className="Modal" onClick={handleCloseModal}>
      <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
        <h2>Classes details:</h2>
        <p><strong>Name:</strong> {selectedEvent.name}</p>
        <p><strong>Date:</strong> {new Date(selectedEvent.start).toLocaleDateString()}</p>
        <p><strong>Start time:</strong> {new Date(selectedEvent.start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
        <p><strong>Recurrent:</strong> {selectedEvent.permanent==='Si' ? 'Yes' : 'No'}</p>
        <p><strong>Participants:</strong> {selectedEvent.BookedUsers.length}/{selectedEvent.capacity}</p>
        {userMail? (
          <>
          {selectedEvent.BookedUsers && selectedEvent.BookedUsers.includes(userMail)  ? (
                <button onClick={() => handleUnbookClass(selectedEvent.id)}>Unbook</button>
              ) : (
                <>
                {selectedEvent.BookedUsers.length<selectedEvent.capacity ? (
                <button onClick={() => handleBookClass(selectedEvent.id)}>Book</button>
                ) :
                (<>
                <button style={{background:'red'}}>Full</button>
                </>)
                }
                </>
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
