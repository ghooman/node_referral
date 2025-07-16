import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../components/unit/MyDatePicker.scss';


function MyDatePicker({ selected, onChange }) {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      dateFormat="yyyy.MM.dd"
      placeholderText="년. 월. 일"
      className="filter-date__input"
    />
  );
}

export default MyDatePicker;