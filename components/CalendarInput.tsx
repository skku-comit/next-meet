import Calendar from "react-calendar";
import { ReactNode, useEffect, useRef, useState } from "react";
import { stringifyDate } from "@/lib/functions/stringifyDate";
import DaysPicker from "./DaysPicker";
import { DaysOfWeek } from "@/template/DaysOfWeek";
import { DateSelection } from "@/template/DateSelection";


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

type DayListProps ={
  dayList: DaysOfWeek[];
}

const DayList = ({dayList}:DayListProps):ReactNode =>{
  return (<div className="">
    {dayList.map((selectedDay,idx)=>
      <div className="" 
        key={idx}>{selectedDay}</div>
    )}
  </div>)
}

type CalendarInputProps ={
  onToggleDateMode:(isWeekly:boolean)=>void;
  onClickDate:(value: Date | DaysOfWeek) =>void;
  selectedDates:DateSelection;
}

const CalendarInput = ({onToggleDateMode,onClickDate,selectedDates}:CalendarInputProps):ReactNode =>{

  type ValuePiece = Date | null;
  type Value = ValuePiece | [ValuePiece, ValuePiece];

  //useStates
  
  //useRef

  //functions
  
  // const [value,onChange] = useState<Value>(null);
    return( 
      <div className="w-screen flex flex-col items-center">
        <p className="text-2xl text-center">Pick specific Dates</p>
        
        {selectedDates.isWeekly ? <DaysPicker
          selectedDays={selectedDates.dateList}
          onClickDay={onClickDate}/> : <Calendar
         className='m-8'
          // onChange={onChange}
          // value={value}
          onClickDay={value=>onClickDate(value as Date)}
          tileClassName={({date,view}) => view === 'month' && selectedDates.dateList.find(target=>target.getTime() === date.getTime()) ? 'react-calendar__selectedTile' : null}
          minDate={new Date()}
        ></Calendar>}
        <div className="flex items-center gap-2">
        <input type='checkbox'
          onChange={(e)=>{
            onToggleDateMode(e.target.checked);
          }}/>
        <label>or pick days of the week</label>
        </div>
        {!selectedDates.isWeekly ? <DateList dateList={selectedDates.dateList as Date[]}/>
        : <DayList dayList={selectedDates.dateList as DaysOfWeek[]}/>}
        </div>
    );
}

export default CalendarInput;