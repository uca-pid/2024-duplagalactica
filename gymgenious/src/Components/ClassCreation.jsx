import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';

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

  const createClass = async () => {
    
    try {
      const response = await fetch('http://localhost:5000/create_class', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name: name,
          Date: date,
          Hour: hour,
          Day: day(date),
          Permanent: permanent,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        navigate('/');
        alert("¡Clase creada exitosamente!");
      } else {
        console.error("Error en la respuesta de la API:", response.statusText);
        alert("Error al crear la clase");
      }
    } catch (error) {
      console.log(name,date,hour,day(date),permanent)
      console.error("Error en el servidor:", error);
      alert("Error en el servidor");
    }
  };
  

  const postClass = (e) => {
    e.preventDefault(); 
    createClass();
  };

  return (
    <div className='App'>
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
      </div>
      <div className='login-container'>
        <h2>Crear clase</h2>
        <form onSubmit={postClass}>
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
