import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicSelect({ selectedDay, setSelectedDay }) {
  const [hovered, setHovered] = React.useState(null);
  const [daySelection, setDaySelection] = React.useState('');

  const handleMouseEnter = (value) => {
    setHovered(value);
  };

  const handleMouseLeave = () => {
    setHovered(null);
  };

  const handleChangeDay = (event) => {
    setDaySelection(event.target.value);
    if(event.target.value==='all'){
        setSelectedDay(null);
    } else {
        setSelectedDay(event.target.value);
    }
  }

  return (
    <Box sx={{ width: '100%', flexWrap: 'wrap', background: '#ffe0b5', border: '2px solid #BC6C25', borderRadius: '10px' }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Day</InputLabel>
        <Select
          sx={{ width: '100%', backgroundColor: '#ffe0b5', borderRadius: '10px' }}
          color="primary"
          value={daySelection}
          onChange={(event) => handleChangeDay(event)}
          aria-label="Platform"
        >
          {['all','sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => (
            <MenuItem
              key={day}
              style={{
                backgroundColor: selectedDay === day || hovered === day ? '#5e2404' : '#b87d48',
                color: 'white',
              }}
              value={day}
              onMouseEnter={() => handleMouseEnter(day)}
              onMouseLeave={handleMouseLeave}
            >
              {day}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
