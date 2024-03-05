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
import { useSearchParams } from "next/navigation";
import { FixedDate, WeeklyFixedDate } from "@/template/WeeklyFixedDate";
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
    setShowMemberList : Function;
    setShowDateTime : Function;
    setTotalScheduleList:Function;
    eventTimeInfo:TimeInfo | undefined;
    eventParti : Participate[] | undefined;
    confirm : number;
    name:string;
    nonMemLogin:boolean;
    loginNonMem:User|undefined;
    isHost:boolean;
    week_startDate:Date;
    eventID:number;
    preMySelected: Date[];
    setPreMySelected : Function;
}

const ScheduleTableConfirm = React.memo(function ScheduleTableConfirm(
    {isLogin, width, week, schedule, totalMem, select, confirm, name, setShowDateTime,
    fixedSchedule, setFixedSchedule, setShowMember, setShowMemberList, setTotalScheduleList, eventID,
    eventTimeInfo, eventParti, nonMemLogin, loginNonMem, isHost, week_startDate,
    preMySelected, setPreMySelected}:MyComponentProps) {

  const state = "CONFIRM";


  const handleChange = async (newSchedule:Date[]) => {
    
    // const getDateDiff = (date1:Date, date2:Date) => {
    
    //   if(date1.getMonth() == date2.getMonth()){
    //     return date1.getDate() - date2.getDate();
    //   }
    //   else{
    //     const dayOfMonth = new Date(date2.getFullYear(), date2.getMonth(), 0);
    //     return dayOfMonth.getDate() - date2.getDate() + date1.getDate()
    //   }
      
    // }

    // const dateList = eventTimeInfo?.dateList.sort((a:Date,b:Date)=>(a.getTime()- b.getTime()))
    // const weekDaySorter:{ [index: string]: number } = { 'Mon':1 , 'Tue':2 , 'Wed':3 , 'Thu':4 , 'Fri':5 , 'Sat':6 ,'Sun':7 , }
    // const sortedSelectedWeekDay = eventTimeInfo?.dayList.sort((a:string,b:string)=>weekDaySorter[a]-weekDaySorter[b])
    // const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


    // let fixedMeeting:FixedDate[] | WeeklyFixedDate[] = [];

    // newSchedule.map((sche)=>{
    //   let fixedSche:WeeklyFixedDate | FixedDate;

    //   const index = getDateDiff(sche, week ? week_startDate : (dateList as Date[])[0]);
    //   const real_sche = week ? (sortedSelectedWeekDay as DaysOfWeek[])[index] : (dateList as Date[])[index];
    //   const time = sche.getHours + ":" + sche.getMinutes;

    //   const existedDate = week ? (fixedMeeting as WeeklyFixedDate[]).filter((weekFD)=>(weekFD.day == real_sche))
    //                       : (fixedMeeting as FixedDate[]).filter((FM)=>(FM.date.getFullYear() == (real_sche as Date).getFullYear()
    //                                                                     && FM.date.getMonth() == (real_sche as Date).getMonth()
    //                                                                     && FM.date.getDate() == (real_sche as Date).getDate()))
      
    //   if(existedDate){
    //     if(week){
    //       fixedMeeting = (fixedMeeting as WeeklyFixedDate[]).filter((weekFD)=>(weekFD.day != real_sche))
    //       existedDate[0].timeRange.push(time);
    //       (fixedMeeting as WeeklyFixedDate[]).push(existedDate[0] as WeeklyFixedDate);
    //     }
    //     else{
    //       fixedMeeting = (fixedMeeting as FixedDate[]).filter((FM)=>(!(FM.date.getFullYear() == (real_sche as Date).getFullYear()
    //                                                                         && FM.date.getMonth() == (real_sche as Date).getMonth()
    //                                                                         && FM.date.getDate() == (real_sche as Date).getDate())))
    //       existedDate[0].timeRange.push(time);
    //       (fixedMeeting as FixedDate[]).push(existedDate[0] as FixedDate);
    //     }
    //   }
    //   else{
    //     if(week){
    //       (fixedMeeting as WeeklyFixedDate[]).push({day : (sortedSelectedWeekDay as DaysOfWeek[])[index], timeRange:[time]})
    //     }
    //     else{
    //       (fixedMeeting as FixedDate[]).push({date : (dateList as Date[])[index], timeRange:[time]})
    //     }
    //   }
      
    // })

    // try {
    //   const res = await fetch("api/form", {
    //     method: "PATCH",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({      
    //       eventID, fixedMeeting, state
    //     }),
    //   });
    //   console.log(res);
    //   const data = await res.json();
    //   console.log(data);
    // } catch (error) {
    //   console.log(error);
    // } 
    setFixedSchedule({schedule:newSchedule})
    // console.log(fixedSchedule.schedule);
   }

//    console.log(fixedSchedule);


  return(
    <ScheduleTableSelecto isLogin={isLogin} schedule={schedule} name={name}
        setShowMember={setShowMember} eventID={eventID} setShowMemberList={setShowMemberList}
        setShowDateTime={setShowDateTime}
        setTotalScheduleList={setTotalScheduleList} totalMem={totalMem}
        fixedSchedule={fixedSchedule} week={week}
        select={select} width={width} eventTimeInfo={eventTimeInfo} eventParti = {eventParti}
        state={state} handleChange={handleChange} confirm={confirm}
        nonMemLogin={nonMemLogin} loginNonMem={loginNonMem} isHost={isHost} week_startDate={week_startDate}
        preMySelected={preMySelected} setPreMySelected={setPreMySelected}
        // fixedDate={null} fixedDay={null} fixedTime={null}
    />
  );
});

export default React.memo(ScheduleTableConfirm);
