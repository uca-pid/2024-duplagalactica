import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/LeftBar.jsx'

export default function CreateClass() {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [date, setDate] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gym, setGym] = useState('');
    const navigate = useNavigate();

    const createAccount = async () => {
        try {
          const response = await fetch('http://localhost:5000/sign_in', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Name: name,
              Lastname: lastName,
              Mail: email,
              Birthday: date,
              Password: password,
              Gym: gym,
            }),
          });
          if (response.ok) {
            const data = await response.json();
            navigate('/');
            alert("¡Cuenta creada exitosamente!");
          } else {
            console.error("Error en la respuesta de la API:", response.statusText);
            alert("Error al crear la Cuenta ");
          }
        } catch (error) {
          //console.log(name,date,hour,day(date),permanent)
          console.error("Error en el servidor:", error);
          alert("Error en el servidor");
        }
      };
    const postAccount = (e) => {
    e.preventDefault(); 
    createAccount();
    };

    return (
    <div className='App'>
        <LeftBar/>
        <div className='create-account-container'>
            <h2>Crear cuenta</h2>
            <form onSubmit={postAccount}>
                <div className="input-container">
                    <label htmlFor="name">Nombre:</label>
                    <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="lastName">Apellido:</label>
                    <input 
                    type="text" 
                    id="lastname" 
                    name="lastname" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="date">Fecha de nacimiento:</label>
                    <input 
                        type="date" 
                        id="date" 
                        name="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="password">Contraseña:</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="name">Gimansio:</label>
                    <input 
                    type="text" 
                    id="gym" 
                    name="gym" 
                    value={gym} 
                    onChange={(e) => setGym(e.target.value)} 
                    />
                </div>
                <button type="submit" className='button_create_account'>
                    Crear cuenta
                </button>
            </form>
        </div>
    </div>
    );
}

