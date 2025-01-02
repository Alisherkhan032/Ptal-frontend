// components/DatePicker.js

import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const CustomDatePicker = ({ onDateChange, label }) => {
  const [value, setValue] = useState(dayjs());

  const handleDateChange = (newValue) => {
    setValue(newValue);
    if (onDateChange) {
      onDateChange(newValue);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Select date"
        onChange={onDateChange}
        value={value}
        slotProps={{
          textField: {
            size: 'small', // Applying the small size to the TextField
          },
        }}
      />  
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
