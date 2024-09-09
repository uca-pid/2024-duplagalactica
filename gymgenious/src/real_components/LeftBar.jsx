import '../App.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';

export default function LeftBar({value}) {
    const navigate = useNavigate();
    const goToMainPage = () => {
        navigate('/');
    };
    const goToLogin = () => {
        navigate('/login');
    };
    const goToClassCreation = () => {
        navigate('/class-creation');
    };
    return (
        <div className='Left-Bar'>
            <div className='Logo-Container'>
                <svg className='Container-Logo' viewBox="0 0 220 210">
                <defs>
                    <path id="circlePath" d="M 110,100 m -90,0 a 90,90 0 1,1 180,0 a 90,90 0 1,1 -180,0" />
                </defs>
                <circle cx="100" cy="100" r="90" fill="#E5E5E5" />
                <image href="/LogoGymGenius.png" x="10" y="10" height="180" width="180" />
                <text color='#14213D'>
                    <textPath href="#circlePath" className="Circle-Text">
                    GymGenius GymGenius GymGenius GymGenius GymGenius GymGenius GymGenius GymGenius
                    </textPath>
                </text>
                </svg>
            </div>
            <div className='user-button'>
                <HomeIcon onClick={goToMainPage} style={{height: '80%',width: '80%',color:'#14213D'}}/>
            </div>
            {
                value=='profi'
                ? (
                    <div className='user-button'>
                    <PersonIcon onClick={goToLogin} style={{height: '80%',width: '80%',color:'#14213D'}}/>
                </div> )
                : (
                <div className='user-button'>
                    <AddIcon onClick={goToClassCreation} style={{height: '80%',width: '80%',color:'#14213D'}}/>
                </div> )
            }
        </div>
    )
}
