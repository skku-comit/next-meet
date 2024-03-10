import scheduleResultCSS from "@/styles/scheduleResult.module.css";
import React, {useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { throttle } from "lodash";
import { FixedDate, WeeklyFixedDate } from "@/template/WeeklyFixedDate";
import { TimeInfo } from "@/template/TimeInfo";
import { DaysOfWeek } from "@/template/DaysOfWeek";
import { useSearchParams } from "next/navigation";
import { language } from '../lib/recoil/language';
import { useRecoilState } from "recoil";
import MaxMemberSche from "@/components/MaxMemberSche"


interface MyComponentProps {
    showResult:boolean;
    setShowResult:Function;
    showMember:boolean;
    showMemberList:string[];
    showDateTime:string;
    scheduleList : {checked_num:{[key:string]:number}, member:{[key:string]:string[]}};
    totalMem:number;
    confirm : number;
    select : number,
    setConfirm : Function;
    setSelect : Function;
    fixedSchedule:{schedule:Date[]};
    setFixedSchedule:Function;
    week: boolean;
    isLogin:boolean;
    width:number;
    isHost:boolean;
    eventTimeInfo:TimeInfo;
    week_startDate:Date;
    schedule:{schedule:Date[]};
    eventID:number;
    setPreFixedSchedule:Function;
    height:number;
    wait2:boolean;

}

const ScheduleResultBottom = React.memo(function ScheduleResultBottom({width, setShowResult, showResult,showMember, scheduleList, totalMem,
    select, setSelect, confirm, setConfirm, fixedSchedule, setFixedSchedule, week, isLogin, isHost, eventTimeInfo, week_startDate, showDateTime,
    showMemberList, schedule, eventID, setPreFixedSchedule, height, wait2
    }:MyComponentProps) {
    
    const [lang, setLang] = useRecoilState(language);
    
    const dateListD:Date[] = eventTimeInfo ? eventTimeInfo.dateList.sort((a:Date,b:Date)=>(new Date(a).getTime()- new Date(b).getTime())) : [];
    const dateList:string[] = dateListD.map((date)=>(new Date(date).toISOString()));
    const selectedWeekDay = eventTimeInfo ? eventTimeInfo.dayList: []; 

    let checked_mem_num: number[] = Object.values(scheduleList.checked_num);;
    let max_checked_mem_sche:string[]= Math.max(...checked_mem_num) == 0 ? [] : Object.keys(scheduleList.checked_num).filter((key: string) => {
        return scheduleList.checked_num[key] === Math.max(...checked_mem_num);
        });    
    const [sortedMemList, setSortedMemList]:[string[], Function] = useState(max_checked_mem_sche.sort((a:string,b:string)=>new Date(a).getTime()-new Date(b).getTime()));

    const [prevTotalMem, setPrevTotalMem] = useState(totalMem);
    
    useEffect(()=>{
        setPrevTotalMem(totalMem);
    },[totalMem]);

    useEffect(()=>{
        if(wait2){
            return;
        }
        if(scheduleList.checked_num){
            checked_mem_num= Object.values(scheduleList.checked_num);
            
            max_checked_mem_sche = Math.max(...checked_mem_num) == 0 ? [] : Object.keys(scheduleList.checked_num).filter((key: string) => {
            return scheduleList.checked_num[key] === Math.max(...checked_mem_num);
            });    
            console.log("max_checked_mem_sche",max_checked_mem_sche)
            
            setSortedMemList(max_checked_mem_sche.sort((a:string,b:string)=>new Date(a).getTime()-new Date(b).getTime()));
            console.log("wait2 change sortmemlist")
        }
    }, [scheduleList, wait2]);
    
    const WEEKDAY2 = ['일', '월', '화', '수', '목', '금', '토'];
    const WEEKDAY3 = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const [showMaxMember, setShowMaxMember] = useState(false);

    let term = 0;
    let mem_term = 0;

    const [sortedList, setSortedList]:[Date[],Function] = useState([]);

    useEffect(()=>{
        setSortedList(fixedSchedule.schedule?.sort((a:Date,b:Date)=>new Date(a).getTime()- new Date(b).getTime()));
    },[fixedSchedule])

    useEffect(()=>{console.log("confirm",confirm)},[confirm])

    const handleConfirm = async (newSchedule:Date[]) => {

        console.log("handleConfirm", newSchedule)
    
        const state = "CONFIRM";

        let fixedMeeting:FixedDate[] | WeeklyFixedDate[] = [];
        const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
        newSchedule.map((sche:Date)=>{
            const time = new Date(sche).getHours() + ":" + new Date(sche).getMinutes();
    
            if(week){
              (fixedMeeting as WeeklyFixedDate[]).push({day : WEEKDAY[new Date(sche).getDay()] as DaysOfWeek, timeRange:[time]})
            }
            else{
              (fixedMeeting as FixedDate[]).push({date : new Date(sche), timeRange:[time]})
            }
          
        })

        console.log("FixedMeeting", fixedMeeting)
    
        try {
          const res = await fetch("http://localhost:3000/api/form", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({      
              eventID, fixedMeeting, state
            }),
          });
          console.log(res);
          const data = await res.json();
          console.log(data);
        } catch (error) {
          console.log(error);
        } 
    }
    
    useEffect(()=>{
        console.log("show showMemberList", showMemberList);
    }, [showMemberList])


  return (
        <div className="flex flex-col h-full justify-between z-25 overflow-hidden overflow-x-auto px-5 pt-3 pb-2 bg-[#f8f9fa] rounded ">
          <div className={`h-full flex flex-row`}>
             <div className={`w-2/4 pr-2`}>
                <div className={`w-full pb-2 mr-1 grid grid-column gap-2 ${width > 768 ? "pl-3" : "border-l-3"}`}>            
                    <div className={`pt-2 mr-1`}>
                        <div className="pl-2 font-bold justify-between items-center">
                            <p>{lang == "ko" ?"확정된 일정":"Fixed Schedule"}</p>
                        </div>
                        <hr className="border-t-2 my-1 mb-2"/>
                        <ul className ={`${scheduleResultCSS.result_scrolling4} px-2 min-h-6 grid grid-column gap-1`} style={{maxHeight: isHost ? ((confirm == 2 || confirm == 3) ? height-60 : height-119): height-60}}>
                            {(confirm != 1 && confirm !=3) && sortedList.length > 0 ? sortedList.map((sche:Date, index)=>{
                                    console.log("sortedList", sortedList)
                                    let diffMin = 0;
                                    let diffMSec = 0;
                                    const schedule:Date = new Date(sche.getTime());
                                    const post_time:Date = fixedSchedule.schedule[index < fixedSchedule.schedule.length-1 ? index+1:index];
                                    const prev_time:Date = fixedSchedule.schedule[index > 0 ? index-1 : index];
                                    if((term == 0) && fixedSchedule.schedule.length > 1){
                                        diffMin = (post_time.getHours()*60 + post_time.getMinutes()) - (schedule.getHours()*60 + schedule.getMinutes());
                                    }
                                    else{
                                        diffMin = (schedule.getHours()*60 + schedule.getMinutes()) - (prev_time.getHours()*60 + prev_time.getMinutes());
                                    }
                                    
                                    if(diffMin == 30){  
                                        term = term + 1;
                                        diffMin = (post_time.getHours()*60 + post_time.getMinutes()) - (schedule.getHours()*60 + schedule.getMinutes());
                                        if(diffMin == 30){
                                            return;
                                        }
                                    }

                                    let start_sche:Date = new Date(schedule.getTime());
                                    let end_sche:Date = new Date(schedule.getTime());
                                    start_sche.setMinutes(start_sche.getMinutes()-(30*(term != 0 ? term-1 : term)));
                                    end_sche.setMinutes(end_sche.getMinutes()+30);
                                    term = 0;
                                    return(
                                        <li className="bg-[lightgray] px-3 pt-3 pb-2 rounded cursor-pointer" onClick={()=>{}}>
                                    
                                            <p className="inline-block">{(week ? "" : start_sche.toLocaleDateString('ko-KR')) + '(' + (lang=="ko" ? WEEKDAY2[start_sche.getDay()] :WEEKDAY3[start_sche.getDay()]) + ')'}</p>
                                            <p className="inline-block ml-0.5">{start_sche.toLocaleTimeString('ko-KR')}</p>
                                            <div className="inline-block mx-1"> ~ </div>
                                            <p className="inline-block">{(week ? "" : start_sche.getUTCDate() == end_sche.getUTCDate() ? "" : (end_sche.toLocaleDateString('ko-KR')) + '(' + (lang=="ko" ? WEEKDAY2[start_sche.getDay()] :WEEKDAY3[start_sche.getDay()]) + ')')}</p>
                                            <p className="inline-block ml-0.5">{end_sche.toLocaleTimeString('ko-KR')}</p>
                                            
                                        </li>
                                    )
                                }):""}
                        </ul>
                    </div>
                </div>
            </div>
            <div className={`w-2/4 border-l-2 ${width > 768 ? "grid-column" : "grid-row"} mr-1 grid gap-2`}>
                <div className={`w-full mr-1 grid grid-column gap-2 pl-3`}>
                <div className="pt-2 mr-1">
                    <div className="flex flex-row pl-2 font-bold justify-between items-center">
                        <p>{lang == "ko" ?"최대인원이 참여 가능한 시간대":"Time with the Maximum Number of People"}</p>
                    </div>
                    <hr className="border-t-2 my-1 mb-2"/>
                    <ul className ={`${scheduleResultCSS.result_scrolling4} px-2 flex flex-col gap-2`} style={{maxHeight: isHost ? ((confirm == 2 || confirm == 3) ? height-60 : height-119) : height-60}}>
                        {sortedMemList ? sortedMemList.map((sche, index)=>{
                            let diffMin = 0;
                            let diffMSec = 0;
                            const schedule:Date = new Date(sche);
                            const post_time:Date = new Date(sortedMemList[index < sortedMemList.length-1 ? index+1:index]);
                            const prev_time:Date = new Date(sortedMemList[index > 0 ? index-1 : index]);
                            if((mem_term == 0) && sortedMemList.length > 1){
                                diffMin = (post_time.getHours()*60 + post_time.getMinutes()) - (schedule.getHours()*60 + schedule.getMinutes());
                            }
                            else{
                                diffMin = (schedule.getHours()*60 + schedule.getMinutes()) - (prev_time.getHours()*60 + prev_time.getMinutes());
                            }
                            
                            if(diffMin == 30){  
                                mem_term = mem_term + 1;
                                diffMin = (post_time.getHours()*60 + post_time.getMinutes()) - (schedule.getHours()*60 + schedule.getMinutes());
                                if(diffMin == 30){
                                    return;
                                }
                            }

                            let start_sche:Date = new Date(schedule.getTime());
                            let end_sche:Date = new Date(schedule.getTime());
                            start_sche.setMinutes(start_sche.getMinutes()-(30*(mem_term != 0 ? mem_term-1 : mem_term)));
                            end_sche.setMinutes(end_sche.getMinutes()+30);
                            mem_term = 0;
                            return(
                                <MaxMemberSche index={index} week={week} start_sche={start_sche} end_sche={end_sche} 
                                scheduleList={scheduleList} sche={sche} isHost={isHost} checked_mem_num={checked_mem_num} 
                                prevTotalMem={prevTotalMem} totalMem={totalMem} week_startDate={week_startDate} dateList={dateList} selectedWeekDay={selectedWeekDay}
                                setFixedSchedule={setFixedSchedule} setSelect={setSelect} setConfirm={setConfirm}
                                eventID={eventID} setPreFixedSchedule={setPreFixedSchedule}/>
                            )
                        }):""}
                    </ul>
                </div>
                </div>
            </div>

            <div>
                <IoMdClose className={`${scheduleResultCSS.closeBtn} fixed right-0.5 cursor-pointer`} 
                    onClick={()=>{setShowResult(false)}}/>
            </div>
        </div>
        {isHost ? select ? "" : ( confirm == 0 || confirm == 1) ? <div className={`sticky bottom-0 flex flex-row gap-2 mt-2 pr-2`}>
            <div className={`w-full p-2 pt-3 rounded hover:font-bold ${confirm == 1 ? "bg-[#ced4da]": select==1? "bg-[#868e96]" : "bg-[darkgray]"} cursor-pointer text-center`}
                onClick={()=>{

                    if(confirm == 0){
                        setConfirm(1);
                    }
                    else if(confirm == 1){ //select 중
                        setConfirm(2); 
                        handleConfirm(fixedSchedule.schedule);
                        console.log("fixedSchedule.schedule",fixedSchedule.schedule);

                        if(fixedSchedule.schedule.length > 0){
                            setSelect(1); 
                            console.log(fixedSchedule.schedule.length);
                        }
                        else{
                            setConfirm(0);
                        }
                        setShowResult(false);
                    
                    }
                }}>
                    {confirm == 1 ? "일정 확정완료" : "일정 확정하기"}
                </div>
            </div> :"": ""}
        </div>
  );
});

export default React.memo(ScheduleResultBottom);
