
import React from "react";
import { TimeInfo } from "@/template/TimeInfo";
import { Participate } from '@/template/Participate';
import ScheduleTableSelecto from "./scheduleTableSelecto";
import { useSession } from "next-auth/react";
import { User } from "@/template/User";
import { addRemoveUserEventID } from "@/lib/functions/CRUD";
import { checkEnvironment } from "@/lib/functions/checkEnv";

const NEXTAUTH_URL = checkEnvironment();

interface MyComponentProps {
    isLogin:boolean;
    week:boolean;
    schedule:{schedule :Date[]};
    name:string;
    setShowMember : Function;
    setShowMemberList : Function;
    setShowDateTime : Function;
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
    wait:boolean;
    setWait:Function;
    setWait2:Function;
    prevTotalMem:number;
    setPrevTotalMem:Function;
}

const ScheduleTableSelectoEdit = React.memo(function ScheduleTableSelectoEdit(
    {eventTimeInfo, eventParti, isLogin, width, week, schedule, 
        setSchedule, confirm, setShowMemberList,setShowDateTime,
        setShowMember, setTotalScheduleList, name, totalMem, 
        fixedSchedule, select,
        nonMemLogin, loginNonMem, isHost, week_startDate, eventID,
        preMySelected, setPreMySelected, setTotalMem,
        wait,setWait, setWait2, prevTotalMem, setPrevTotalMem
      }:MyComponentProps) {
  
   const { data: session } = useSession();
   const state = "EDIT";

   const handleChange = async (newSchedule:Date[]) => {

    setSchedule((prev: { schedule: Date[]; })=>{
      if(prev.schedule.length <= 0){
        setWait(true);
        // console.log("wait true");
      }
      return {schedule: newSchedule}
    })

    if(isLogin){
      if(newSchedule.length > 0){
        const res = await addRemoveUserEventID(eventID, session && session.user ? session.user : loginNonMem, "addUser");
        const { userID, existedUser, message } = await res.json();
        if(existedUser && existedUser.length <=0) setTotalMem((prev:number)=>(prev+1));
      }
      else{
        const res = await addRemoveUserEventID(eventID, session && session.user ? session.user : loginNonMem, "removeUser");
        const { userID, existedUser, message } = await res.json();
        if(existedUser && existedUser.length > 0) setTotalMem((prev:number)=>(prev-1));
      }
    }    

    // setWait(false); console.log("wait false");

    let participateStatus:Participate[]|undefined = eventParti;


    const preSelected = eventParti?.filter((part)=>(part && part.user.length > 0 ?  part!.user.filter((user)=>(user.userID == (session ? session.user.userID : loginNonMem?.userID))).length > 0 : false));

    console.log("preSelected",preSelected)
    preSelected?.map((sche:Participate, idx)=>{
      const newIncludePre = newSchedule.filter((newSche)=>{
          return(new Date(sche.time).getTime() == new Date(newSche).getTime())});
      if(!(newIncludePre.length > 0)){
        let participate = (eventParti ? eventParti : []).filter((part)=>(new Date(part.time).getTime() == new Date(sche.time).getTime()));
        let part:Participate = participate[0];
        participateStatus = eventParti?.filter((part)=>(new Date(part.time).getTime() != new Date(sche.time).getTime()));
        if(part){
          const users = part.user.filter((user)=>(user.userID != (session ? session.user.userID : loginNonMem?.userID)));
          part.user = users;
          participateStatus?.push(part)
        }
      }
    })  

    // console.log("participateStatus before newSchedule", participateStatus);

    newSchedule.map((sche:Date, idx)=>{

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
          participateStatus?.push(new_participate)
        }
      }      
    })    

    console.log("final participateStatus",participateStatus)


    try {
      const res = await fetch(`${NEXTAUTH_URL}/api/event`, {
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

  return (
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
      setPrevTotalMem={setPrevTotalMem}// fixedDate={null} fixedDay={null} fixedTime={null}
    />
  );
});

export default React.memo(ScheduleTableSelectoEdit);
