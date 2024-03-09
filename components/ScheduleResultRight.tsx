import scheduleResultCSS from "@/styles/scheduleResult.module.css";
import React, {useEffect, useMemo, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { language } from '../lib/recoil/Language';
import { useRecoilState } from "recoil";
import MaxMemberSche from "@/components/MaxMemberSche"
import { TimeInfo } from "@/template/TimeInfo";

interface MyComponentProps {
    showResult:boolean;
    setShowResult:Function;
    showMember:boolean;
    showMemberList:string[];
    scheduleList : {checked_num:{[key:string]:number}, member:{[key:string]:string[]}};
    totalMem:number;
    confirm : number;
    select : number,
    setConfirm : Function;
    setSelect : Function;
    fixedSchedule:{schedule:Date[]};
    setFixedSchedule:Function;
    week:boolean;
    isLogin:boolean;
    isHost:boolean;
    week_startDate:Date;
    eventTimeInfo:TimeInfo | undefined;
    eventID:number;
    setPreFixedSchedule:Function;
    wait2: boolean;
}

const ScheduleResultRight = React.memo(function ScheduleResultRight({setShowResult, showResult,showMember, scheduleList, totalMem,
    select, setSelect, confirm, setConfirm, fixedSchedule, setFixedSchedule, week, isLogin, isHost, showMemberList, week_startDate, eventTimeInfo 
    , eventID, setPreFixedSchedule, wait2}:MyComponentProps) {

    const [lang, setLang] = useRecoilState(language);

    const dateListD:Date[] = eventTimeInfo ? eventTimeInfo.dateList.sort((a:Date,b:Date)=>(new Date(a).getTime()- new Date(b).getTime())) : [];
    const dateList:string[] = dateListD.map((date)=>(new Date(date).toISOString()));
    const selectedWeekDay = eventTimeInfo ? eventTimeInfo.dayList: []; 

    let checked_mem_num: number[] = Object.values(scheduleList.checked_num);
    let max_checked_mem_sche:string[]=Object.keys(scheduleList.checked_num).filter((key: string) => {
        return scheduleList.checked_num[key] === Math.max(...checked_mem_num);
        });    ;
    const [sortedMemList, setSortedMemList]:[string[], Function] = useState(max_checked_mem_sche.sort((a:string,b:string)=>new Date(a).getTime()-new Date(b).getTime()));

    const [prevTotalMem, setPrevTotalMem] = useState(totalMem);
    useEffect(()=>{
        if(wait2){
            return;
        }
        setPrevTotalMem(totalMem); console.log("right totalMem", totalMem)
    },[totalMem, wait2]);

    useEffect(()=>{
        if(wait2){
            return;
        }
        if(scheduleList.checked_num){
            checked_mem_num= Object.values(scheduleList.checked_num);
            
            max_checked_mem_sche = Object.keys(scheduleList.checked_num).filter((key: string) => {
            return scheduleList.checked_num[key] === Math.max(...checked_mem_num);
            });    
            console.log("max_checked_mem_sche",max_checked_mem_sche)
            setSortedMemList(max_checked_mem_sche.sort((a:string,b:string)=>new Date(a).getTime()-new Date(b).getTime()));
        }
    }, [scheduleList, wait2]);

    
    const WEEKDAY2 = ['일', '월', '화', '수', '목', '금', '토'];
    const WEEKDAY3 = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    
    let term:number = 0;
    let mem_term:number = 0;

    const [sortedList, setSortedList]:[Date[],Function] = useState([]);


    useEffect(()=>{
        setSortedList(fixedSchedule.schedule.sort((a:Date,b:Date)=>new Date(a).getTime()-new Date(b).getTime()));
    },[fixedSchedule])
    

  return (
    <div className="w-5/12 flex flex-col gap-3 overflow-hidden overflow-x-auto place-self-start" style={{minWidth:"260px"}}>
        <div className="p-5 bg-[#f8f9fa] rounded place-self-start w-full">
            <div className="">
                <div className="pl-2 break-all font-bold">{lang=="ko"? "참여 가능한 사람":"Members"}</div>
                <hr className="border-t-2 my-1 mb-2"/>
                <ul className ={`${scheduleResultCSS.result_height} border-separate px-2 min-h-4 `}>
                    {showMember ? showMemberList?.map((member)=>{
                        return(
                            <li>{member}</li>
                        )
                    }):""}
                </ul>
            </div>
        </div>
        <div className="p-5 bg-[#f8f9fa] rounded place-self-start w-full">            
            <div className="pt-2 mr-1">
                <div className="pl-2 font-bold justify-between items-center">
                    <p>{lang == "ko" ?"최대인원이 참여 가능한 시간대":"Time with the Maximum Number of People"}</p>
                </div>
                <hr className="border-t-2 my-1 mb-2"/>
                <ul className ={`${scheduleResultCSS.result_scrolling3} px-2 min-h-4 flex flex-col gap-2`}>
                    {sortedMemList.length > 0 ? sortedMemList.map((sche, index)=>{
                        console.log("sortedMemList Map")
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
        <div className="w-full p-5 bg-[#f8f9fa] rounded place-self-start">            
            <div className="pt-2 mr-1">
                <div className="pl-2 font-bold justify-between items-center">
                    <p>{lang == "ko" ?"확정된 일정":"Fixed Schedule"}</p>
                </div>
                <hr className="border-t-2 my-1 mb-2"/>
                <ul className ={`px-2 min-h-6 grid grid-column gap-1 ${scheduleResultCSS.result_scrolling2}`}>
                    {sortedList.map((sche:Date, index)=>{
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
                        })}
                </ul>
            </div>
        </div>
        {isHost && !select ? <div className={`w-full mt-1 p-2 pt-3 rounded hover:font-bold ${confirm == 1 ? "bg-[#ced4da]": select==1? "bg-[#868e96]" : "bg-[darkgray]"} cursor-pointer text-center`}
            onClick={()=>{

                if(confirm == 0 || confirm == 2){
                    setConfirm(1);
                }
                else if(confirm == 1){ //select 중
                    setConfirm(0); 
                    console.log(fixedSchedule.schedule);

                    if(fixedSchedule.schedule.length > 0){
                        setSelect(1); 
                    }
                
                }
            }}>
                {confirm == 1 ? (lang=="ko" ? "일정 확정완료":"Confirmed Complete") : (lang == "ko" ? "일정 확정하기":"Schedule confirmed")}
            </div>:""}
        </div>
  );
});

export default React.memo(ScheduleResultRight);
