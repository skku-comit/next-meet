import scheduleTableCSS from "@/styles/scheduleTable.module.css";
import React, {useState, useEffect } from "react";
// import Selecto from "react-selecto";
import ScheduleSelector from 'react-schedule-selector';
// import WeeklyFixedDate from '@/template/WeeklyFixedDate';
import {ko} from 'date-fns/locale';
import { format } from 'date-fns';
// import { type } from './../template/User';
const className_div_theadtd = 'rounded-2xl p-3 pt-4 text-black';
import { DaysOfWeek } from "@/template/DaysOfWeek";
import { TimeInfo } from "@/template/TimeInfo";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { Participate } from '@/template/Participate';
import ScheduleTableSelecto from "./scheduleTableSelecto";
import { useSession } from "next-auth/react";


interface MyComponentProps {
    // fixedDate:Date[]|WeeklyFixedDate[] | null;
    // fixedDate:Date[] | null;
    // fixedDay:DaysOfWeek[] | null;
    // fixedTime:{startTime:string, endTime:string} | null;
    isLogin:boolean;
    week:boolean|0;
    schedule:{schedule :Date[]};
    // commitFixedSchedule:{schedule :Date[]};
    name:string;
    // showMember:string[];
    // setShowResult : Function;
    setShowMember : Function;
    // scheduleList : {checked_num:{[key:string]:number}, member:{[key:string]:string[]}};
    // setScheduleList : Function;
    setTotalScheduleList:Function;
    totalMem:number;
    select:number;
    fixedSchedule : {schedule :Date[]};
    width:number;
    eventTimeInfo:TimeInfo | undefined;
    eventParti : Participate[] | undefined;
    setSchedule:Function;
    confirm : number;
}

const ScheduleTableSelectoEdit = React.memo(function ScheduleTableSelectoEdit(
    {eventTimeInfo, eventParti, isLogin, width, week, schedule, 
        setSchedule, confirm,
        setShowMember, setTotalScheduleList, name, totalMem, 
        fixedSchedule, select}:MyComponentProps) {
  
//    const [schedule, setSchedule] = useState({schedule :[]})
   const { data: session } = useSession();
   const handleChange = (newSchedule:Date[]) => {
    setSchedule({schedule:newSchedule})

    // console.log(typeof(schedule.schedule));
   }

   useEffect(()=>{if(isLogin){setSchedule({schedule:[]})}}, [isLogin]);

   const state = "EDIT";

  return (
    <ScheduleTableSelecto isLogin={isLogin} schedule={schedule} name={name}
        setShowMember={setShowMember} 
        setTotalScheduleList={setTotalScheduleList} totalMem={totalMem}
        fixedSchedule={fixedSchedule} week={week} confirm={confirm}
        select={select} width={width} eventTimeInfo={eventTimeInfo} eventParti = {eventParti} 
        state={state} handleChange={handleChange}
        // fixedDate={null} fixedDay={null} fixedTime={null}
    />
  );
});

export default React.memo(ScheduleTableSelectoEdit);
