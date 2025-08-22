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
      placeholderText="Year. Month. Day"
      className="filter-date__input"
      portalId="root-portal"

    />
  );
}

export default MyDatePicker;
