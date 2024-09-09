import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

export default function CreateClassButton() {
    const navigate = useNavigate();
    return (
      <Box sx={{ '& > :not(style)': { m: 1 } }} className='create-class-button'>
        <Fab size="small" color="secondary" aria-label="add">
          <AddIcon onClick={()=>navigate('/class-creation')}/>
        </Fab>
      </Box>
    );
  }