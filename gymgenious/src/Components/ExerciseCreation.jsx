import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment'

export default function ExerciseCreation() {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const userMail = urlParams.get('mail');
  const handleCreateExersice = async () => {
    try {  
      const newExersice = {
        name: name,
        description: desc
      };
  
      const response = await fetch('http://127.0.0.1:5000/create_exersice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExersice),
      });

      if (!response.ok) {
        throw new Error('Error al crear ejercicio');
      }
  
      navigate('/', { state: { message: 'block' } });
      alert("Ejercicio creado exitosamente!");
    } catch (error) {
      console.error("Error al crear el ejercicio:", error);
  };
} 

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateExersice();
  };

  return (
    <div className='class-creation-container'>
      <div className='class-creation-content'>
        <h2 style={{color:'#14213D'}}>Create exercise</h2>
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
          <button type="submit" className='button_login'>
            Create exercise
          </button>
        </form>
      </div>
    </div>
  );
}
