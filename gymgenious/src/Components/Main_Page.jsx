import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Button from '@mui/material/Button';

const localizer = momentLocalizer(moment);

const Calendar = ({ events }) => {
  return (
    <div className="Calendar-Container">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', background: '#14213D' }}
        views={['month']}
      />
    </div>
  );
};

export default function Main_Page() {
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [showCalendar, setShowCalendar] = useState(true);
  const navigate = useNavigate();

  const changeShowCalendar = () => {
    setShowCalendar(prevState => !prevState);
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const goToCreateClass = () => {
    navigate('/class-creation');
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch('http://localhost:5000/classes');
      if (response.ok) {
        const data = await response.json();
        setClasses(data);

        const calendarEvents = data.map(clase => ({
          title: clase.Name,
          start: new Date(clase.Date + 'T' + clase.Hour),
          end: new Date(clase.Date + 'T' + (parseInt(clase.Hour.split(':')[0]) + 1) + ':' + clase.Hour.split(':')[1]), // Supone una hora de duración
        }));
        setEvents(calendarEvents);
      } else {
        console.error("Error en la respuesta de la API:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  useEffect(() => {
    fetchClasses(); 
  }, []);

  return (
    <div className="App">
      <div className='Left-Bar'>
        <div className='Logo-Container'>
          <svg className='Container-Logo' viewBox="0 0 220 210">
            <defs>
              <path id="circlePath" d="M 110,100 m -90,0 a 90,90 0 1,1 180,0 a 90,90 0 1,1 -180,0" />
            </defs>
            <circle cx="100" cy="100" r="90" fill="#14213D" />
            <image href="/LogoGymGenius.png" x="10" y="10" height="180" width="180" />
            <text>
              <textPath href="#circlePath" className="Circle-Text">
                GymGenius GymGenius GymGenius GymGenius GymGenius GymGenius GymGenius GymGenius
              </textPath>
            </text>
          </svg>
        </div>
        <Button variant="contained" color="primary">
          Click Me
        </Button>
      </div>

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
          <Calendar events={events} />
        </div>
      ) : (
        <div className="Table-Container">
          {classes.length > 0 ? (
            <table className="Table-Classes">
              <thead className="Table-Classes-Header">
                <tr>
                  <th>Nombre</th>
                  <th>Hora</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody className="Table-Classes-Rows">
                {classes.map((clase, index) => (
                  <tr key={index}>
                    <td>{clase.Name}</td>
                    <td>{clase.Hour}</td>
                    <td>{clase.Date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay clases disponibles aún.</p>
          )}
        </div>
      )}
    </div>
  );
}
