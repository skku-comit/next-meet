import scheduleTableCSS from "@/styles/scheduleTable.module.css";
import React, {useState, useEffect } from "react";
// import Selecto from "react-selecto";
import ScheduleSelector from 'react-schedule-selector';
import { DaysOfWeek } from "@/template/DaysOfWeek";
import { TimeInfo } from "@/template/TimeInfo";
import { Participate } from "@/template/Participate";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
// import WeeklyFixedDate from '@/template/WeeklyFixedDate';
import {ko} from 'date-fns/locale';
import { format } from 'date-fns';
import ScheduleTableSelecto from "./scheduleTableSelecto";
import { NextMeetUser, User } from "@/template/User";
// import { type } from './../template/User';
const className_div_theadtd = 'rounded-2xl p-3 pt-4 text-black';

interface MyComponentProps {
    // fixedDate:Date[] | null;
    // fixedDay:DaysOfWeek[] | null;
    // fixedTime:{startTime:String, lastTime:String} | null;
    isLogin:boolean;
    week:boolean|0;
    select:number;
    totalMem:number;
    schedule:{schedule :Date[]};
    fixedSchedule:{schedule :Date[]};
    setFixedSchedule:Function;
    width:number;
    setShowMember : Function;
    setTotalScheduleList:Function;
    eventTimeInfo:TimeInfo | undefined;
    eventParti : Participate[] | undefined;
    confirm : number;
    name:string;
    nonMemLogin:boolean;
    loginNonMem:User|undefined;
    isHost:boolean;

}

const ScheduleTableConfirm = React.memo(function ScheduleTableConfirm(
    {isLogin, width, week, schedule, totalMem, select, confirm, name,
    fixedSchedule, setFixedSchedule, setShowMember, setTotalScheduleList, 
    eventTimeInfo, eventParti, nonMemLogin, loginNonMem, isHost}:MyComponentProps) {

  const handleChange = (newSchedule:Date[]) => {
    setFixedSchedule({schedule:newSchedule})
    // console.log(fixedSchedule.schedule);
   }

//    console.log(fixedSchedule);

  const state = "CONFIRM";

  return(
    <ScheduleTableSelecto isLogin={isLogin} schedule={schedule} name={name}
        setShowMember={setShowMember} 
        setTotalScheduleList={setTotalScheduleList} totalMem={totalMem}
        fixedSchedule={fixedSchedule} week={week}
        select={select} width={width} eventTimeInfo={eventTimeInfo} eventParti = {eventParti}
        state={state} handleChange={handleChange} confirm={confirm}
        nonMemLogin={nonMemLogin} loginNonMem={loginNonMem} isHost={isHost}
        // fixedDate={null} fixedDay={null} fixedTime={null}
    />
  );
});

export default React.memo(ScheduleTableConfirm);
