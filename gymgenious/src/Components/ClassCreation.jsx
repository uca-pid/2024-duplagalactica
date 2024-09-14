import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/LaftBarMaterial.jsx';
import moment from 'moment'

export default function CreateClass() {
  const [hour, setHour] = useState('');
  const [hourFin, setHourFin] = useState('');
  const [permanent, setPermanent] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const day = (dateString) => {
    const date = new Date(dateString);
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return daysOfWeek[date.getDay()];
  };

  const handleCreateClass = async () => {
    const format= "HH:mm";
    const realHourEnd = moment(hourFin, format).subtract(30, 'minutes').format(format);
    try {
      if(moment(realHourEnd, format).isBefore(moment(hour, format))){
        throw new Error('La clase debe durar al menos 30 minutos');
      }
  
      const isoDateStringInicio = `${date}T${hour}:00Z`;
      const isoDateStringFin = `${date}T${hourFin}:00Z`;
  
      const newClass = {
        name: name,
        dateInicio: isoDateStringInicio,
        dateFin: isoDateStringFin,
        hour: hour,
        day: day(date),
        permanent: permanent,
      };
  
      const response = await fetch('http://127.0.0.1:5000/create_class', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClass),
      });
  
      if (!response.ok) {
        throw new Error('Error al crear la clase');
      }
  
      navigate('/', { state: { message: 'block' } });
      alert("¡Clase creada exitosamente!");
    } catch (error) {
      console.error("Error al crear la clase:", error);
      if(moment(realHourEnd, format).isBefore(moment(hour, format))){
        alert('La clase debe durar al menos 30 minutos');
      } else if (name=='') {
      alert("Ingrese un nombre para la clase");
     } else if (permanent=='') {
      alert("Ingrese si la clase es recurrente o no");
     } else if (date=='') {
      alert("Ingrese la fecha de la clase");
     } else {
      alert("Error al crear la clase");
     }
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateClass();
  };

  return (
    <div className='App'>
      <LeftBar value={'add'}/>
      <div className='class-creation-container'>
        <div className='class-creation-content'>
          <h2 style={{color:'#14213D'}}>Create class</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
              <div className="input-small-container">
                <label htmlFor="hour" style={{color:'#14213D'}}>Start time:</label>
                <input 
                  type="time" 
                  id="hour" 
                  name="hour" 
                  value={hour} 
                  onChange={(e) => setHour(e.target.value)} 
                />
              </div>
              <div className="input-small-container">
                <label htmlFor="hour" style={{color:'#14213D'}}>End time:</label>
                <input 
                  type="time" 
                  id="hourFin" 
                  name="hourFin" 
                  value={hourFin} 
                  onChange={(e) => setHourFin(e.target.value)} 
                />
              </div>
              <div className="input-small-container">
                <label htmlFor="name" style={{color:'#14213D'}}>Name:</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
            </div>
            <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
              <div className="input-small-container" style={{width:"100%"}}>
                <label htmlFor="permanent" style={{color:'#14213D'}}>Recurrent:</label>
                <select 
                  id="permanent" 
                  name="permanent" 
                  value={permanent} 
                  onChange={(e) => setPermanent(e.target.value)} 
                >
                  <option value="" >Select</option>
                  <option value="Si">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="input-small-container" style={{ flex: 3, textAlign: 'left' }}>
                <label htmlFor="date" style={{color:'#14213D'}}>Date:</label>
                <input 
                  type="date" 
                  id="date" 
                  name="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                />
              </div>
            </div>
            <button type="submit" className='button_login'>
              Crear clase
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
