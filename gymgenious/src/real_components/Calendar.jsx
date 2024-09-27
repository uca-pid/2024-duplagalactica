import React, {useState} from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { GlobalStyles } from '@mui/material';

const localizer = momentLocalizer(moment);

export default function Calendar ({ events, onSelectEvent }) {
  

  const eventStyleGetter = (event) => {
    let backgroundColor = '';
    if(event.BookedUsers.length<event.capacity){
      backgroundColor = '#5e2407 !important';
    } else {
      backgroundColor = '#dda581 !important';
    }
    const style = {
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
      display: 'block',
      padding: '5px',
      border: 'none',
      '.rbc-event.custom-event': { backgroundColor: {backgroundColor} } 
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