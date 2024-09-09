import React from 'react';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';

export default function LeftBar({value}) {
    const navigate = useNavigate();

    const goToMainPage = () => {
        if(value=='add'){
            navigate('/', { state: { message: 'block' } });
        } else {
            navigate('/');
        }
    };

    const goToLogin = () => {
        navigate('/login');
    };

    const goToClassCreation = () => {
        navigate('/class-creation')
    }

    return (
        <Box 
            sx={{ 
                width: '5%', 
                height: '100vh', 
                backgroundColor: '#E5E5E5', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                top: 0,
                left: 0,
                zIndex: 1200
            }}
        >
            <Box 
                sx={{ 
                    width: '100%', 
                    display: 'flex', 
                    flex:1,
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center'
                }}
            >
                <svg viewBox="0 -5 220 210" style={{ width: '100%' }}>
                    <defs>
                        <path id="circlePath" d="M 110,100 m -90,0 a 90,90 0 1,1 180,0 a 90,90 0 1,1 -180,0" />
                    </defs>
                    <circle cx="100" cy="100" r="95" fill="#E5E5E5" />
                    <image href="/LogoGymGenius.png" x="10" y="10" height="190" width="180" />
                    <text color='#14213D'>
                        <textPath href="#circlePath" className="Circle-Text">
                            GymGenius GymGenius GymGenius GymGenius GymGenius GymGenius GymGenius GymGenius
                        </textPath>
                    </text>
                </svg>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center',flex:2 }}>
                <HomeIcon onClick={goToMainPage} style={{ fontSize: '6vh', color: '#14213D', cursor: 'pointer',flex:1 }} />
                {
                    value=='profile'
                    ? 
                    (<PersonIcon onClick={goToLogin} style={{ fontSize: '6vh', color: '#14213D', cursor: 'pointer', marginTop: 2,flex:1 }} />)
                    : 
                    (<AddIcon onClick={goToClassCreation} style={{ fontSize: '6vh', color: '#14213D', cursor: 'pointer', marginTop: 2,flex:1 }} />)
                }
            </Box>
        </Box>
    );
}
