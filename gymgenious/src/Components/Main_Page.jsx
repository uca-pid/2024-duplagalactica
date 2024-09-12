import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import LeftBar from '../real_components/LaftBarMaterial.jsx';
import { getClasses } from '../routes/classes.js';
import EnhancedTable from '../real_components/TableClasses.jsx';

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

  const location = useLocation();
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
      const data = await getClasses();
      setClasses(data);
    
      const calendarEvents = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      data.forEach(clase => {
        const startDate = new Date(clase.dateInicio);
        const CorrectStarDate = new Date(startDate.getTime() + 60 *3* 60 * 1000);
        const dayOfWeek = CorrectStarDate.getDay(); 
        let nextStartDate = new Date(today);
        let daysUntilNextClass = (dayOfWeek - today.getDay() + 7) % 7;
        if (daysUntilNextClass === 0 && today > CorrectStarDate) {
          daysUntilNextClass = 7; 
        }
        nextStartDate.setDate(today.getDate() + daysUntilNextClass);
        nextStartDate.setHours(CorrectStarDate.getHours(), CorrectStarDate.getMinutes(), CorrectStarDate.getSeconds());
        const endDate = new Date(clase.dateFin); 
        const CorrectEndDate = new Date(endDate.getTime()+60*3*60*1000);
        let nextEndDate = new Date(nextStartDate.getTime() + (CorrectEndDate.getTime() - CorrectStarDate.getTime()));
        if (clase.permanent === "Si") {
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
      <div className="Calendar-Button">
        <button onClick={changeShowCalendar} className="Toggle-Button">
          {showCalendar ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9H6Z" fill="#E5E5E5"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L15 12L9 18V6Z" fill="#E5E5E5"/>
            </svg>
          )}
        </button>
      </div>

      {showCalendar ? (
        <div className="WebApp-Body">
          <Calendar events={events} onSelectEvent={handleSelectEvent} />
        </div>
      ) : (
        <div className="Table-Container">
          <EnhancedTable rows={classes} />
        </div>
      )}

      {selectedEvent && (
        <div className="Modal" onClick={handleCloseModal}>
          <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
            <h2>Detalles de la Clase</h2>
            <p><strong>Nombre:</strong> {selectedEvent.name}</p>
            <p><strong>Fecha:</strong> {new Date(selectedEvent.start).toLocaleDateString()}</p>
            <p><strong>Hora:</strong> {new Date(selectedEvent.start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
            <p><strong>Todas las semanas:</strong> {selectedEvent.permanent==='Si' ? 'Sí' : 'No'}</p>
            <button onClick={handleCloseModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
