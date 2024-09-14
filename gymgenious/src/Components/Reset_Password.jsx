import '../App.css';
import React, { useState } from 'react';
import LeftBar from '../real_components/LaftBarMaterial.jsx';
import { useNavigate } from 'react-router-dom';
import { getAuth,sendPasswordResetEmail } from 'firebase/auth';

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [showNotMatchEmail, setShowNoMatchEmail] = useState(false)
    const navigate = useNavigate();

    const auth = getAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = new URL('http://localhost:3000/get_unique_user_by_email');
            url.searchParams.append('mail', email); 
            await sendPasswordResetEmail(auth, email); 
            alert('Email sent successfully!');
            navigate('/'); 
        } catch (error) {
            setShowNoMatchEmail(true)
            console.error("Error sending email:", error);
        }
    };



    return (
        <div className='App'>
            <LeftBar value={'profile'}/>
            <div className='reset-password-container'>
                <div className='reset-password-content'>
                    <h2 style={{color:'#14213D'}}>Reset password</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-container">
                            <label htmlFor="email" style={{color:'#14213D'}}>Email:</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required
                            />
                        </div>
                        <button type="submit" className='button_create_account'>
                            Send recovery email
                        </button>
                        {showNotMatchEmail ? (
                            <div style={{color:'red'}}>This account does not exist</div>
                        ):(
                            <div></div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}