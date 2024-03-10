import Calendar from "react-calendar";
import { ReactNode, useEffect, useRef, useState } from "react";
import { stringifyDate } from "@/lib/functions/stringifyDate";
import DaysPicker from "./DaysPicker";
import { DaysOfWeek } from "@/template/DaysOfWeek";
import { DateSelection } from "@/template/DateSelection";
import { useRecoilValue } from "recoil";
import { language } from '../lib/recoil/language';

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
    const lang = useRecoilValue(language);
    return( 
      <div className="w-screen flex flex-col items-center">
        <p className="text-2xl text-center">{lang==='ko' ? '날짜 선택' : 'Select Date'}</p>
        
        {selectedDates.isWeekly ? <DaysPicker
          selectedDays={selectedDates.dateList}
          onClickDay={onClickDate}/> : <Calendar
          locale={lang === 'ko' ? 'ko' : 'en'}
          className='m-8'
          onClickDay={value=>{
            onClickDate(value as Date);
          }}
          tileClassName={({date,view}) => view === 'month' && selectedDates.dateList.find(target=>target.getTime() === date.getTime()) ? 'react-calendar__selectedTile' : null}
          minDate={new Date()}
        ></Calendar>}
        <div className="flex items-center gap-2">
        <input type='checkbox'
          onChange={(e)=>{
            onToggleDateMode(e.target.checked);
          }}/>
        <label>{lang==='ko' ? '또는 요일 선택' : 'or choose from week'}</label>
        </div>
        {/* {!selectedDates.isWeekly ? <DateList dateList={selectedDates.dateList as Date[]}/>
        : <DayList dayList={selectedDates.dateList as DaysOfWeek[]}/>} */}
        </div>
    );
}

export default CalendarInput;