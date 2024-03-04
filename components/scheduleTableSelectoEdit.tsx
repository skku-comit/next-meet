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
import { User, NextMeetUser } from "@/template/User";
import { useParams, useSearchParams } from "next/navigation";


interface MyComponentProps {
    // fixedDate:Date[]|WeeklyFixedDate[] | null;
    // fixedDate:Date[] | null;
    // fixedDay:DaysOfWeek[] | null;
    // fixedTime:{startTime:string, endTime:string} | null;
    isLogin:boolean;
    week:boolean;
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
    nonMemLogin:boolean;
    loginNonMem:User|undefined;
    isHost:boolean;
    week_startDate:Date;
    eventID:number;

}

const ScheduleTableSelectoEdit = React.memo(function ScheduleTableSelectoEdit(
    {eventTimeInfo, eventParti, isLogin, width, week, schedule, 
        setSchedule, confirm,
        setShowMember, setTotalScheduleList, name, totalMem, 
        fixedSchedule, select,
        nonMemLogin, loginNonMem, isHost, week_startDate, eventID
      }:MyComponentProps) {
  
//    const [schedule, setSchedule] = useState({schedule :[]})
   const { data: session } = useSession();
   const state = "EDIT";

   const getDateDiff = (date1:Date, date2:Date) => {
    
    if(new Date(date1).getMonth() == new Date(date2).getMonth()){
      return new Date(date1).getDate() - new Date(date2).getDate();
    }
    else{
      const dayOfMonth = new Date(new Date(date2).getFullYear(), new Date(date2).getMonth(), 0);
      return dayOfMonth.getDate() - new Date(date2).getDate() + new Date(date1).getDate()
    }
    
  }

  const dateList = eventTimeInfo?.dateList.sort((a:Date,b:Date)=>(new Date(a).getTime()- new Date(b).getTime()))
  console.log("eventTimeInfo",eventTimeInfo);
  console.log("dateList",dateList);
  const weekDaySorter:{ [index: string]: number } = { 'Mon':1 , 'Tue':2 , 'Wed':3 , 'Thu':4 , 'Fri':5 , 'Sat':6 ,'Sun':7}
  const sortedSelectedWeekDay = eventTimeInfo?.dayList.sort((a:string,b:string)=>weekDaySorter[a]-weekDaySorter[b])
  const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // const params = useParams();
  // const eventID = params.get('id');
  // console.log("eventID EDIT", params)

  // console.log("loginNonMem", loginNonMem)
  //   const eventParticipate = isLogin && eventParti && eventParti?.length > 0 ? eventParti.filter((participate:Participate) => {
      // console.log(participate.user, loginNonMem, participate.user.includes(session && session.user ? session.user : loginNonMem));
    //   return(participate.user.includes(session && session.user ? session.user : loginNonMem))}) : null;
    // console.log("eventParticipate",eventParticipate);
    // const eventParticiTime = {schedule : eventParticipate ? eventParticipate[0].time : [] }
    // setSchedule(eventParticiTime);
    // console.log(eventParticiTime);

    // useEffect(()=>{
      const eventParticipate = eventParti && eventParti.length > 0 ? eventParti?.filter((participate:Participate) =>{ 
        for(let i = 0; i<participate.user.length; i++){
            console.log("eventParticiTime v", participate.user[i].userID, loginNonMem?.userID)
            if(participate.user[i].userID == loginNonMem?.userID){
                return true;
            }
        }
        return false}) : null;
      const eventParticiTime = {schedule : eventParticipate ? eventParticipate.map((participate:Participate)=>(participate.time)) : [] }
      console.log("eventParticiTime",eventParticiTime,eventParticipate)
      setSchedule(eventParticiTime);    
    // }, [])
    
   const handleChange = async (newSchedule:Date[]) => {

    let participateStatus:Participate[]|undefined = eventParti;

    // console.log("participateStatus",participateStatus)

    const preSelected = eventParti?.filter((part)=>(part && part.user.length > 0 ?  part!.user.filter((user)=>(user.userID == (session ? session.user.userID : loginNonMem?.userID))).length > 0 : false));

    console.log("preSelected",preSelected)
    preSelected?.map((sche:Participate, idx)=>{
      const index = getDateDiff(sche.time, week ? week_startDate : (dateList as Date[])[0]);
      let real_sche:Date;
      if(week){
          real_sche = new Date(week_startDate);
          for(let i=0; i<7; i++){
              if(WEEKDAY[real_sche.getDay()] == (sortedSelectedWeekDay as DaysOfWeek[])[index]){
                  break;
              }
              real_sche.setDate(real_sche.getDate() + 1)
          }
          real_sche.setHours(new Date(sche.time).getHours());
          real_sche.setMinutes(new Date(sche.time).getMinutes());
      }
      else{
          real_sche = new Date((dateList as Date[])[index]);
          real_sche.setHours(new Date(sche.time).getHours());
          real_sche.setMinutes(new Date(sche.time).getMinutes());
      }

      if(newSchedule.includes(sche.time) == false){
        let participate = (eventParti ? eventParti : []).filter((part)=>(new Date(part.time).getTime() == new Date(real_sche).getTime()));
        const part:Participate = participate[0];
        participateStatus = eventParti?.filter((part)=>(new Date(part.time).getTime() != new Date(real_sche).getTime()));
        if(part){
          const users = part.user.filter((user)=>(user!= (session ? session.user : loginNonMem)));
          part.user = users;
          participateStatus?.push(part)
        }
      }
    })  

    newSchedule.map((sche:Date, idx)=>{
      const index = getDateDiff(sche, week ? week_startDate : (dateList as Date[])[0]);
      let real_sche:Date;
      if(week){
          real_sche = new Date(week_startDate);
          for(let i=0; i<7; i++){
              if(WEEKDAY[real_sche.getDay()] == (sortedSelectedWeekDay as DaysOfWeek[])[index]){
                  break;
              }
              real_sche.setDate(real_sche.getDate() + 1)
          }
          real_sche.setHours(new Date(sche).getHours());
          real_sche.setMinutes(new Date(sche).getMinutes());
      }
      else{
          real_sche = new Date((dateList as Date[])[index]);
          real_sche.setHours(new Date(sche).getHours());
          real_sche.setMinutes(new Date(sche).getMinutes());
      }
      
      // console.log("part2 eventParti",idx, eventParti);

      let participate2 = eventParti ? eventParti.filter((part)=>(new Date(part.time).getTime() == new Date(real_sche).getTime())):null;
      const part2= participate2 && participate2.length > 0 ? participate2[0] : null;
      // console.log("part2",idx, part2, participate2);
      if(part2){
        if(!(part2!.user.filter((user)=>(user.userID == (session ? session.user.userID : loginNonMem?.userID))).length > 0)){
          participateStatus = eventParti?.filter((part)=>(new Date(part.time).getTime() != new Date(real_sche).getTime()));
          (session && session.user) || loginNonMem ? part2!.user.push(session ? session.user : loginNonMem) : "";
          participateStatus?.push(part2)
        }
      }
      else{
        const new_participate:Participate = {time : sche, user : session ? session.user : loginNonMem}
        if(new_participate.user.length > 0) {participateStatus?.push(new_participate)}
      }      
    })    

    console.log("final participateStatus",participateStatus)

    setSchedule({schedule:newSchedule})

    try {
      const res = await fetch("http://localhost:3000/api/form", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({      
          eventID, participateStatus, state
        }),
      });
      console.log(res);
      const data = await res.json();
      console.log("data", data);
    } catch (error) {
      console.log("error",error);
    } 
    console.log("typeof",typeof(schedule.schedule));

    
   }

   useEffect(()=>{if(isLogin){setSchedule({schedule:[]})}}, [isLogin]);



  return (
    <ScheduleTableSelecto isLogin={isLogin} schedule={schedule} name={name}
        setShowMember={setShowMember} eventID={eventID}
        setTotalScheduleList={setTotalScheduleList} totalMem={totalMem}
        fixedSchedule={fixedSchedule} week={week} confirm={confirm}
        select={select} width={width} eventTimeInfo={eventTimeInfo} eventParti = {eventParti} 
        state={state} handleChange={handleChange}
        nonMemLogin={nonMemLogin} loginNonMem={loginNonMem} isHost={isHost} week_startDate={week_startDate}
        // fixedDate={null} fixedDay={null} fixedTime={null}
    />
  );
});

export default React.memo(ScheduleTableSelectoEdit);
