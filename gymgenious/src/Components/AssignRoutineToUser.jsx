import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UsserAssignment from './UsersAssignment.jsx';

export default function RoutineCreation({ email }) {
    const [routineAssigned, setRoutine] = useState('');
    const [users, setUsers] = useState([]);
    const [routines, setRoutines] = useState([]);
    const navigate = useNavigate();

    const fetchRoutines = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/get_routines');
            if (!response.ok) {
                throw new Error('Error al obtener las rutinas: ' + response.statusText);
            }
            const data = await response.json();
            setRoutines(data); 
        } catch (error) {
            console.error("Error fetching rutinas:", error);
        }
    };

    useEffect(() => {
        fetchRoutines();
    }, []);

    const handleAssignRoutine = async () => {
        try {
            const newAsignRoutine = {
                routine: routineAssigned,
                user: users,
                owner: email
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

            navigate(`/?mail=${email}`);
            alert("¡Rutina asignada exitosamente!");
        } catch (error) {
            console.error("Error al asignar la rutina:", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAssignRoutine();
    };

    const handleUsersChange = (newUsers) => {
        setUsers(newUsers);
    };

    return (
        <div className='class-creation-container'>
            <div className='class-creation-content'>
                <h2 style={{ color: '#14213D' }}>Assign users</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className="input-small-container">
                            <label htmlFor="routineAssigned" style={{ color: '#14213D' }}>Routine:</label>
                            <select 
                                id="routineAssigned" 
                                name="routineAssigned" 
                                value={routineAssigned} 
                                onChange={(e) => setRoutine(e.target.value)}
                            >
                                <option value="">Select</option>
                                {routines.map((routine) => (
                                    <option key={routine.id} value={routine.name}>
                                        {routine.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="input-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className="input-small-container">
                            <label htmlFor="users" style={{ color: '#14213D' }}>Users:</label>
                            <UsserAssignment onUsersChange={handleUsersChange} />
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
