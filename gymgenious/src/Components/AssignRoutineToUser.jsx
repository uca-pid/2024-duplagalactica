import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/LaftBarMaterial.jsx';
import moment from 'moment'
import UserAssignment from './UsersAssignment.jsx'

export default function RoutineCreation() {
    const [routineAssigned, setRoutine] = useState('');
    const [users, setUsers] = useState('');
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const userMail = urlParams.get('mail');
  const handleAssignRoutine = async () => {
    try {  
      const newAsignRoutine = {
        routine: routineAssigned,
        user: users
      };
      const response = await fetch('http://127.0.0.1:5000/assign_routine_to_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAsignRoutine),
      });
 
      if (!response.ok) {
        throw new Error('Error al asignar la rutina');
      }
 
      navigate('/', { state: { message: 'block' } });
      alert("¡Rutina asignada exitosamente!");
    } catch (error) {
      console.error("Error al asigna la rutina:", error);
    };
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAssignRoutine();
  };

  return (
    <div className='class-creation-container'>
      <div className='class-creation-content'>
        <h2 style={{color:'#14213D'}}>Assign users</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
              <div className="input-small-container">
              <label htmlFor="routineAssigned" style={{color:'#14213D'}}>Routine:</label>
                  <select 
                      id="routineAssigned" 
                      name="routineAssigned" 
                      value={routineAssigned} 
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
                  <UserAssignment/>
              </div>
          </div>
          <button type="submit" className='button_login'>
            Assign users
          </button>
        </form>
      </div>
    </div>
  );
}
