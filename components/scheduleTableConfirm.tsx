import React from "react";
import { TimeInfo } from "@/template/TimeInfo";
import { Participate } from "@/template/Participate";
import ScheduleTableSelecto from "./scheduleTableSelecto";
import { NextMeetUser, User } from "@/template/User";

interface MyComponentProps {
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
    wait:boolean;
    setWait2:Function;
    prevTotalMem:number;
    setPrevTotalMem:Function;
}

const ScheduleTableConfirm = React.memo(function ScheduleTableConfirm(
    {isLogin, width, week, schedule, totalMem, select, confirm, name, setShowDateTime,
    fixedSchedule, setFixedSchedule, setShowMember, setShowMemberList, setTotalScheduleList, eventID,
    eventTimeInfo, eventParti, nonMemLogin, loginNonMem, isHost, week_startDate,
    preMySelected, setPreMySelected, wait, setWait2, prevTotalMem, setPrevTotalMem}:MyComponentProps) {

  const state = "CONFIRM";


  const handleChange = async (newSchedule:Date[]) => {
    setFixedSchedule({schedule:newSchedule})
  }

  return(
    <ScheduleTableSelecto 
      isLogin={isLogin} 
      schedule={schedule} 
      name={name}
      setShowMember={setShowMember}
      eventID={eventID} 
      setShowMemberList={setShowMemberList}
      setShowDateTime={setShowDateTime}
      setTotalScheduleList={setTotalScheduleList} 
      totalMem={totalMem}
      fixedSchedule={fixedSchedule} 
      week={week} 
      confirm={confirm}
      select={select} 
      width={width} 
      eventTimeInfo={eventTimeInfo} 
      eventParti = {eventParti} 
      state={state} 
      handleChange={handleChange}
      nonMemLogin={nonMemLogin} 
      loginNonMem={loginNonMem} 
      isHost={isHost} 
      week_startDate={week_startDate}
      preMySelected={preMySelected} 
      setPreMySelected={setPreMySelected}
      wait={wait} 
      setWait2={setWait2} 
      prevTotalMem={prevTotalMem}
      setPrevTotalMem={setPrevTotalMem}/>
  );
});

export default React.memo(ScheduleTableConfirm);
