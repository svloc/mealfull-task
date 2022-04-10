import React, { useState } from "react";
import "./style.css";
import DatePicker from "react-datepicker";
import Home from "./Home";
import "react-datepicker/dist/react-datepicker.css";
export default function App() {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <div>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}/>
      <Home date={startDate} />
    </div>
  );
}
