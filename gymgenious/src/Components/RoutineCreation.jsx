import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/LaftBarMaterial.jsx';
import moment from 'moment'

export default function RoutineCreation() {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [exercises, setExercises] = useState('');
    const navigate = useNavigate();

  const handleCreateRoutine = async () => {
    try {  
      const newRoutine = {
        name: name,
        description: desc,
        excercises: exercises,
      };
      const response = await fetch('http://127.0.0.1:5000/create_routine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRoutine),
      });
 
      if (!response.ok) {
        throw new Error('Error al crear la rutina');
      }
 
      navigate('/', { state: { message: 'block' } });
      alert("¡Rutina creada exitosamente!");
    } catch (error) {
      console.error("Error al crear la rutina:", error);
  };
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateRoutine();
  };

  return (
    <div className='App'>
      <LeftBar value={'add'}/>
      <div className='class-creation-container'>
        <div className='class-creation-content'>
          <h2 style={{color:'#14213D'}}>Create routine</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
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
                <div className="input-small-container">
                    <label htmlFor="desc" style={{color:'#14213D'}}>Desc:</label>
                    <input 
                    type="text" 
                    id="desc" 
                    name="desc" 
                    value={desc} 
                    onChange={(e) => setDesc(e.target.value)} 
                    />
                </div>
            </div>
            <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                <div className="input-small-container">
                    <label htmlFor="exercises" style={{color:'#14213D'}}>Exercises:</label>
                    <select 
                        id="exercises" 
                        name="exercises" 
                        value={exercises} 
                        onChange={(e) => setExercises(e.target.value)} 
                        >
                        <option value="" >Select</option>
                        <option value="Bench press">Bench press</option>
                        <option value="Barbell curl">Barbell curl</option>
                        <option value="Bar Push Downs">Bar Push Downs</option>
                    </select>
                </div>
            </div>
            <button type="submit" className='button_login'>
              Create routine
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
