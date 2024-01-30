import Calendar from "react-calendar";
import { ReactNode, useEffect, useState } from "react";
import { stringifyDate } from "@/lib/functions/stringifyDate";
// import "@/styles/calendar.css";
// import 'react-calendar/dist/Calendar.css';


type DateListProps ={
  dateList: Date[];
}

const DateList = ({dateList}:DateListProps):ReactNode =>{
  return <div className="">
    {dateList.map((selectedDate,idx)=>
      <div className="" 
        key={idx}>{stringifyDate(selectedDate)}</div>
    )}
  </div>
}

const CalendarInput = ():ReactNode =>{

  type ValuePiece = Date | null;
  type Value = ValuePiece | [ValuePiece, ValuePiece];

  //useStates
  const [selectedDates,setSelectedDates] = useState<Date[]>([]);
 
  //useEffects

  //functions
  const dateClickHandler = (value: Date) => {
    if (selectedDates.find(date => date.getTime() === value.getTime()) === undefined) {
        setSelectedDates(prev => [...prev, value]); // add new date
    } else {
        setSelectedDates(prev => prev.filter(date => date.getTime() !== value.getTime())); // remove date
    }
};


  // const [value,onChange] = useState<Value>(null);
    return( 
      <div className="w-screen flex flex-col items-center">
        <p className="text-2xl text-center">Pick the Dates</p>
        <Calendar
         className='m-8'
          // onChange={onChange}
          // value={value}
          onClickDay={(value)=>dateClickHandler(value)}
          tileClassName={({date,view}) => view === 'month' && selectedDates.find(target=>target.getTime() === date.getTime()) ? 'react-calendar__selectedTile' : null}
          minDate={new Date()}
        ></Calendar>
        <DateList dateList={selectedDates}/>
        </div>
    );
}

export default CalendarInput;