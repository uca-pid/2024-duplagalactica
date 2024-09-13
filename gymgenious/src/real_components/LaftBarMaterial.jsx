import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import ExitToApp from '@mui/icons-material/ExitToApp'

export default function LeftBar({ value }) {
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);

    const goToMainPage = () => {
        if (value === 'add') {
            navigate('/', { state: { message: 'block' } });
        } else {
            navigate('/');
        }
    };

    const goToLogin = () => {
        navigate('/login');
    };

    const goToClassCreation = () => {
        navigate('/class-creation');
    };
    
    const [showBox, setShowBox] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
        setShowBox(true);
        }, 200);
    
        return () => clearTimeout(timer);
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const changeValue = () => {
        navigate('/', { state: { message: '' } });
    }

    return (
        <Box
            sx={{
                width: '5%',
                height: '100%',
                backgroundColor: '#E5E5E5',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                top: 0,
                left: 0,
                zIndex: 1200,
                justifyContent: 'space-between',
                '@media (max-width: 765px)': {
                    width: '100%',
                    height: '7%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    position:'absolute',
                    top: 0,
                    bottom: 'auto',
                }
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '@media (max-width: 765px)': {
                        flexDirection: 'row',
                        width: 'auto',
                        height: '100%',
                    }
                }}
            > {showBox && (
                <> {value === 'add' ? (
                    <ExitToApp
                        onClick={changeValue}
                        style={{ fontSize: '6vh', color: 'red', cursor: 'pointer' }}
                    />
                ) : (
                    <svg viewBox="0 -5 220 210" style={{ width: '100%', height: '100%' }}>
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
                    )}
                </>
                )}
            </Box>

            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 1,
                    '@media (max-width: 765px)': {
                        flexDirection: 'row',
                        width: 'auto',
                        height: '100%'
                    }
                }}
            >
                <HomeIcon
                    onClick={goToMainPage}
                    style={{ fontSize: '6vh', color: '#14213D', cursor: 'pointer' }}
                />
            </Box>

            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '@media (max-width: 765px)': {
                        flexDirection: 'row',
                        width: 'auto',
                    }
                }}
            > { showBox ? (
                <>
                {value === 'profile' ? (
                    <PersonIcon
                        onClick={goToLogin}
                        style={{ fontSize: '6vh', color: '#14213D', cursor: 'pointer' }}
                    />
                ) : (
                    <AddIcon
                        onClick={goToClassCreation}
                        style={{ fontSize: '6vh', color: '#14213D', cursor: 'pointer' }}
                    />
                )}
            </> ) : (null)}
            </Box>
        </Box>
    );
}
