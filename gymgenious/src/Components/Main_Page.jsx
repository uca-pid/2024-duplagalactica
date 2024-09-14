import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import LeftBar from '../real_components/LaftBarMaterial.jsx';
import EnhancedTable from '../real_components/TableClasses.jsx';
import { useMediaQuery } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

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
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:250px)');
  const location = useLocation();
  const [openCircularProgress, setOpenCircularProgress] = useState(true)
  useEffect(() => {
    if (location.state?.message === 'block') {
      setLeftBarOption('add');
    } else {
      setLeftBarOption('profile');
    }
  }, [location.state]);

  const changeShowCalendar = () => {
    setShowCalendar(prevState => !prevState);
    handleCloseModal()
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/get_classes');
      console.log("HOLA")
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
      setOpenCircularProgress(false)
      setEvents(calendarEvents);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };
  useEffect(() => {
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
      <LeftBar value={leftBarOption}/>
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



      {selectedEvent && (
        <div className="Modal" onClick={handleCloseModal}>
          <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
            <h2>Class details</h2>
            <p><strong>Name:</strong> {selectedEvent.name}</p>
            <p><strong>Date:</strong> {new Date(selectedEvent.start).toLocaleDateString()}</p>
            <p><strong>Start time:</strong> {new Date(selectedEvent.start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
            <p><strong>Recurrent:</strong> {selectedEvent.permanent==='Si' ? 'Yes' : 'No'}</p>
            { leftBarOption==='add' &&
               ( <button onClick={handleCloseModal}>Booking</button> )}
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
