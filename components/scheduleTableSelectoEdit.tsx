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
import { addRemoveUserEventID } from "@/lib/functions/CRUD";


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
    setShowMemberList : Function;
    setShowDateTime : Function;
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
    preMySelected : Date[];
    setPreMySelected : Function;
    setTotalMem : Function;
}

const ScheduleTableSelectoEdit = React.memo(function ScheduleTableSelectoEdit(
    {eventTimeInfo, eventParti, isLogin, width, week, schedule, 
        setSchedule, confirm, setShowMemberList,setShowDateTime,
        setShowMember, setTotalScheduleList, name, totalMem, 
        fixedSchedule, select,
        nonMemLogin, loginNonMem, isHost, week_startDate, eventID,
        preMySelected, setPreMySelected, setTotalMem
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
  // console.log("eventTimeInfo",eventTimeInfo);
  // console.log("dateList",dateList);
  const weekDaySorter:{ [index: string]: number } = { 'Mon':1 , 'Tue':2 , 'Wed':3 , 'Thu':4 , 'Fri':5 , 'Sat':6 ,'Sun':7}
  const sortedSelectedWeekDay = eventTimeInfo?.dayList.sort((a:string,b:string)=>weekDaySorter[a]-weekDaySorter[b])
  const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(()=>{
    // console.log("schedule.schedule", schedule.schedule)
  },[schedule]);
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
      // const eventParticipate = eventParti && eventParti.length > 0 ? eventParti?.filter((participate:Participate) =>{ 
      //   for(let i = 0; i<participate.user.length; i++){
      //       console.log("eventParticiTime v", participate.user[i].userID, loginNonMem?.userID)
      //       if(participate.user[i].userID == loginNonMem?.userID){
      //           return true;
      //       }
      //   }
      //   return false}) : null;
      // const eventParticiTime = {schedule : eventParticipate ? eventParticipate.map((participate:Participate)=>(participate.time)) : [] }
      // console.log("eventParticiTime",eventParticiTime,eventParticipate)
      // setSchedule(eventParticiTime);    
    // }, [])
    
   const handleChange = async (newSchedule:Date[]) => {

    setSchedule({schedule:newSchedule})

    if(isLogin){
      if(newSchedule.length > 0){
        const res = await addRemoveUserEventID(eventID, session && session.user ? session.user : loginNonMem, "addUser");
        const data = await res.json();
        console.log("addUser handle", data);
        if(data.data[1]?.length <=0){setTotalMem((prev:number)=>(prev+1))};
      }
      else{
        const res = await addRemoveUserEventID(eventID, session && session.user ? session.user : loginNonMem, "removeUser");
        const data = await res.json();
        console.log("removeUser handle", data);
        if(data.data[1]?.length > 0){setTotalMem((prev:number)=>(prev-1))};
      }
    }

    let participateStatus:Participate[]|undefined = eventParti;

    // console.log("participateStatus",participateStatus)

    const preSelected = eventParti?.filter((part)=>(part && part.user.length > 0 ?  part!.user.filter((user)=>(user.userID == (session ? session.user.userID : loginNonMem?.userID))).length > 0 : false));

    console.log("preSelected",preSelected)
    preSelected?.map((sche:Participate, idx)=>{
      // const index = getDateDiff(sche.time, week ? week_startDate : (dateList as Date[])[0]);
      // let real_sche:Date;
      // if(week){
      //     real_sche = new Date(week_startDate);
      //     for(let i=0; i<7; i++){
      //         if(WEEKDAY[real_sche.getDay()] == (sortedSelectedWeekDay as DaysOfWeek[])[index]){
      //             break;
      //         }
      //         real_sche.setDate(real_sche.getDate() + 1)
      //     }
      //     real_sche.setHours(new Date(sche.time).getHours());
      //     real_sche.setMinutes(new Date(sche.time).getMinutes());
      // }
      // else{
      //     real_sche = new Date((dateList as Date[])[index]);
      //     real_sche.setHours(new Date(sche.time).getHours());
      //     real_sche.setMinutes(new Date(sche.time).getMinutes());
      // }

      const newIncludePre = newSchedule.filter((newSche)=>{
          // console.log("includes new", new Date(newSche), new Date(sche.time) )
          return(new Date(sche.time).getTime() == new Date(newSche).getTime())});
      // console.log("includes", newSchedule, newIncludePre.length, !(newIncludePre.length > 0));
      if(!(newIncludePre.length > 0)){
        let participate = (eventParti ? eventParti : []).filter((part)=>(new Date(part.time).getTime() == new Date(sche.time).getTime()));
        let part:Participate = participate[0];
        // console.log("includes new", part);
        participateStatus = eventParti?.filter((part)=>(new Date(part.time).getTime() != new Date(sche.time).getTime()));
        if(part){
          const users = part.user.filter((user)=>(user.userID != (session ? session.user.userID : loginNonMem?.userID)));
          part.user = users;
          // console.log("includes part user", part.user, users, session ? session.user : loginNonMem);
          participateStatus?.push(part)
        }
      }
    })  

    console.log("participateStatus before newSchedule", participateStatus)

    newSchedule.map((sche:Date, idx)=>{
      // const index = getDateDiff(sche, week ? week_startDate : (dateList as Date[])[0]);
      // let real_sche:Date;
      // if(week){
      //     real_sche = new Date(week_startDate);
      //     for(let i=0; i<7; i++){
      //         if(WEEKDAY[real_sche.getDay()] == (sortedSelectedWeekDay as DaysOfWeek[])[index]){
      //             break;
      //         }
      //         real_sche.setDate(real_sche.getDate() + 1)
      //     }
      //     real_sche.setHours(new Date(sche).getHours());
      //     real_sche.setMinutes(new Date(sche).getMinutes());
      // }
      // else{
      //     real_sche = new Date((dateList as Date[])[index]);
      //     real_sche.setHours(new Date(sche).getHours());
      //     real_sche.setMinutes(new Date(sche).getMinutes());
      // }
      
      // console.log("part2 eventParti",idx, eventParti);

      let participate2 = eventParti ? eventParti.filter((part)=>(new Date(part.time).getTime() == new Date(sche).getTime())):null;
      let part2= participate2 && participate2.length > 0 ? participate2[0] : null;
      console.log("part2",idx, part2, participate2);
      if(part2){
        if(!(part2!.user.filter((user)=>(user.userID == (session && session.user ? session.user.userID : loginNonMem?.userID))).length > 0)){
          participateStatus = eventParti?.filter((part)=>(new Date(part.time).getTime() != new Date(sche).getTime()));
          if((session && session.user)) {
            part2!.user.push(session.user)
          }
          else if(loginNonMem){
            part2!.user.push(loginNonMem)
          }
          participateStatus?.push(part2)
        }
      }
      else{
        const new_participate:Participate = {time : sche, user : session && session.user ? [session.user] : loginNonMem ? [loginNonMem] : []}
        console.log("part2", new_participate, new_participate.user, session?.user, new_participate.user.length > 0)
        if(new_participate.user.length > 0) {
          // console.log("part2 push")
          participateStatus?.push(new_participate)
        }
      }      
    })    

    console.log("final participateStatus",participateStatus)


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

  //  useEffect(()=>{if(!isLogin){setSchedule({schedule:[]})}}, [isLogin]);



  return (
    <ScheduleTableSelecto isLogin={isLogin} schedule={schedule} name={name}
        setShowMember={setShowMember} eventID={eventID} setShowMemberList={setShowMemberList}
        setShowDateTime={setShowDateTime}
        setTotalScheduleList={setTotalScheduleList} totalMem={totalMem}
        fixedSchedule={fixedSchedule} week={week} confirm={confirm}
        select={select} width={width} eventTimeInfo={eventTimeInfo} eventParti = {eventParti} 
        state={state} handleChange={handleChange}
        nonMemLogin={nonMemLogin} loginNonMem={loginNonMem} isHost={isHost} week_startDate={week_startDate}
        preMySelected={preMySelected} setPreMySelected={setPreMySelected}
        // fixedDate={null} fixedDay={null} fixedTime={null}
    />
  );
});

export default React.memo(ScheduleTableSelectoEdit);
