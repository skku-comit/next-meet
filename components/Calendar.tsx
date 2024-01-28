import Calendar from "react-calendar";
import { ReactNode, useState } from "react";
// import "@/styles/calendar.css";
// import 'react-calendar/dist/Calendar.css';

const CalendarComponent = ():ReactNode =>{

  type ValuePiece = Date | null;
  type Value = ValuePiece | [ValuePiece, ValuePiece];

  const [value,onChange] = useState<Value>(new Date());
    return( 
        <Calendar 
          onChange={onChange}
          value={value}
          
        ></Calendar>
    );
}

export default CalendarComponent;