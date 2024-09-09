import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import LeftBar from '../real_components/LaftBarMaterial.js';
import { getClasses } from '../firestoreService';
import EnhancedTable from '../real_components/TableClasses.js';

const localizer = momentLocalizer(moment);

const Calendar = ({ events, onSelectEvent }) => {
  return (
    <div className="Calendar-Container">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', background: '#14213D' }}
        views={['month', 'day']}
        onSelectEvent={onSelectEvent}
      />
    </div>
  );
};

export default function Main_Page() {
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // Para manejar el evento seleccionado
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

      data.forEach(clase => {
        const startDate = new Date(clase.date);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

        const adjustedStartDate = new Date(startDate.toLocaleString("en-US", { timeZone: "UTC" }));
        const adjustedEndDate = new Date(endDate.toLocaleString("en-US", { timeZone: "UTC" }));

        if (clase.permanent) {
          for (let i = 0; i < 4; i++) {
            const weeklyStartDate = new Date(adjustedStartDate);
            weeklyStartDate.setDate(adjustedStartDate.getDate() + i * 7);
            const weeklyEndDate = new Date(adjustedEndDate);
            weeklyEndDate.setDate(adjustedEndDate.getDate() + i * 7);

            calendarEvents.push({
              title: clase.name,
              start: weeklyStartDate,
              end: weeklyEndDate,
              allDay: false,
              ...clase,
            });
          }
        } else {
          calendarEvents.push({
            title: clase.name,
            start: adjustedStartDate,
            end: adjustedEndDate,
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
            <p><strong>Hora:</strong> {new Date(selectedEvent.start).toLocaleTimeString()}</p>
            <p><strong>Todas las semanas:</strong> {selectedEvent.permanent ? 'Sí' : 'No'}</p>
            <button onClick={handleCloseModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
