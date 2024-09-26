import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useState } from 'react';

export default function ColorToggleButton( {selectedDay, setSelectedDay} ) {
    const [hovered, setHovered] = useState(null);

    const handleMouseEnter = (value) => {
        setHovered(value);
    };

    const handleMouseLeave = () => {
        setHovered(null);
    };

    return (
        <ToggleButtonGroup
            color="primary"
            value={selectedDay}
            exclusive
            onChange={(event, newDay) => setSelectedDay(newDay)}
            aria-label="Platform"
        >
            {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => (
                <ToggleButton
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
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}