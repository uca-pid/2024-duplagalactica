import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

