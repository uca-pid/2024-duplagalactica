import React from 'react'
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import CheckIcon from '@mui/icons-material/Check';

export default function SuccessAlert({successAlert, message}) {
    return (
        <>
            {successAlert ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Slide direction="up" in={successAlert} mountOnEnter unmountOnExit >
                                <Alert style={{fontSize:'100%', fontWeight:'bold'}} icon={<CheckIcon fontSize="inherit" /> } severity="success">
                                    {message}
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
