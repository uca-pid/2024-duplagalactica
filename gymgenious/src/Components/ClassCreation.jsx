import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClass } from '../firestoreService'; 
import LeftBar from '../real_components/LaftBarMaterial.js';

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
      const newClass = {
        Name: name,
        Date: date,
        Hour: hour,
        Day: day(date),
        Permanent: permanent,
      };
      await createClass(newClass); 
      navigate('/'); 
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
      <LeftBar/>
      <div className='login-container'>
        <h2>Crear clase</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
            <div className="input-small-container">
              <label htmlFor="hour">Hora:</label>
              <input 
                type="time" 
                id="hour" 
                name="hour" 
                value={hour} 
                onChange={(e) => setHour(e.target.value)} 
              />
            </div>
            <div className="input-small-container">
              <label htmlFor="name">Nombre:</label>
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
              <label htmlFor="permanent">Permanente:</label>
              <select 
                id="permanent" 
                name="permanent" 
                value={permanent} 
                onChange={(e) => setPermanent(e.target.value)} 
              >
                <option value="">Seleccionar</option>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="input-small-container" style={{ flex: 3, textAlign: 'right' }}>
              <label htmlFor="date">Fecha:</label>
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
