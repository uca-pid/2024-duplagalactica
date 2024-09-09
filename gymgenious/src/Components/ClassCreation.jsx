import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClass } from '../firestoreService'; 
import LeftBar from '../real_components/LaftBarMaterial.jsx';

export default function CreateClass() {
  const [hour, setHour] = useState('');
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
    try {
      const isoDateString = `${date}T${hour}:00Z`;
      const newClass = {
        name: name,
        date: isoDateString,
        hour: hour,
        day: day(date),
        permanent: permanent,
      };
      console.log(isoDateString)
      await createClass(newClass); 
      navigate('/', { state: { message: 'block' } }); 
      alert("¡Clase creada exitosamente!");
    } catch (error) {
      console.error("Error al crear la clase:", error);
      alert("Error al crear la clase");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateClass();
  };

  return (
    <div className='App'>
      <LeftBar value={'add'}/>
      <div className='login-container'>
        <h2 style={{color:'#14213D'}}>Crear clase</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
            <div className="input-small-container">
              <label htmlFor="hour" style={{color:'#14213D'}}>Hora:</label>
              <input 
                type="time" 
                id="hour" 
                name="hour" 
                value={hour} 
                onChange={(e) => setHour(e.target.value)} 
              />
            </div>
            <div className="input-small-container">
              <label htmlFor="name" style={{color:'#14213D'}}>Nombre:</label>
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
              <label htmlFor="permanent" style={{color:'#14213D'}}>Permanente:</label>
              <select 
                id="permanent" 
                name="permanent" 
                value={permanent} 
                onChange={(e) => setPermanent(e.target.value)} 
              >
                <option value="" >Seleccionar</option>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="input-small-container" style={{ flex: 3, textAlign: 'right' }}>
              <label htmlFor="date" style={{color:'#14213D'}}>Fecha:</label>
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
  );
}
