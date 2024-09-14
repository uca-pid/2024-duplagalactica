import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/LaftBarMaterial.jsx';
import moment from 'moment'

export default function RoutineCreation() {
    const [routine, setRoutine] = useState('');
    const [users, setUsers] = useState('');
    const navigate = useNavigate();

//   const handleCreateClass = async () => {
//     try {  
//       const newClass = {
//         name: name,
//         dateInicio: isoDateStringInicio,
//         dateFin: isoDateStringFin,
//         hour: hour,
//         day: day(date),
//         permanent: permanent,
//       };
  
//       const response = await fetch('http://127.0.0.1:5000/create_class', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newClass),
//       });
  
//       if (!response.ok) {
//         throw new Error('Error al crear la clase');
//       }
  
//       navigate('/', { state: { message: 'block' } });
//       alert("¡Clase creada exitosamente!");
//     } catch (error) {
//       console.error("Error al crear la clase:", error);
//   };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    //handleCreateClass();
  };

  return (
    <div className='App'>
      <LeftBar value={'add'}/>
      <div className='class-creation-container'>
        <div className='class-creation-content'>
          <h2 style={{color:'#14213D'}}>Assign users</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                <div className="input-small-container">
                <label htmlFor="routine" style={{color:'#14213D'}}>Routine:</label>
                    <select 
                        id="routine" 
                        name="routine" 
                        value={routine} 
                        onChange={(e) => setRoutine(e.target.value)} 
                        >
                        <option value="" >Select</option>
                        <option value="Routine 1">Routine 1</option>
                        <option value="Routine 2">Routine 2</option>
                        <option value="Routine 3">Routine 3</option>
                    </select>
                </div>
            </div>
            <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                <div className="input-small-container">
                    <label htmlFor="users" style={{color:'#14213D'}}>Users:</label>
                    <select 
                        id="users" 
                        name="users" 
                        value={users} 
                        onChange={(e) => setUsers(e.target.value)} 
                        >
                        <option value="" >Select</option>
                        <option value="User 1">User 1</option>
                        <option value="User 2">User 2</option>
                        <option value="User 3">User 3</option>
                    </select>
                </div>
            </div>
            <button type="submit" className='button_login'>
              Assign users
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
