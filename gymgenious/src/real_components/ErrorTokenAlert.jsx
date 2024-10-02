import React from 'react'
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';

export default function ErrorTokenAlert({errorToken}) {
    return (
        <>
            {errorToken ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Slide direction="up" in={errorToken} mountOnEnter unmountOnExit >
                                <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="error">
                                    Invalid Token!
                                </Alert>
                            </Slide>
                        </Box>
                    </div>
                </div>
            ) : (
                null
            )}
        </>
    )
}
