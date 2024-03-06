import scheduleResultCSS from "@/styles/scheduleResult.module.css";
import React, {useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { throttle } from "lodash";
import { FixedDate, WeeklyFixedDate } from "@/template/WeeklyFixedDate";
import { TimeInfo } from "@/template/TimeInfo";
import { DaysOfWeek } from "@/template/DaysOfWeek";
import { useSearchParams } from "next/navigation";
import { language } from '../lib/recoil/Language';
import { useRecoilState } from "recoil";

interface MyComponentProps {
    // fixedDate:Date[]|WeeklyFixedDate[] | null;
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
}

const ScheduleResultBottom = React.memo(function ScheduleResultBottom({width, setShowResult, showResult,showMember, scheduleList, totalMem,
    select, setSelect, confirm, setConfirm, fixedSchedule, setFixedSchedule, week, isLogin, isHost, eventTimeInfo, week_startDate, showDateTime,
    showMemberList, schedule, eventID}:MyComponentProps) {
    
    const [lang, setLang] = useRecoilState(language);
    
    let checked_mem_num: number[] = Object.values(scheduleList.checked_num);;
    let max_checked_mem_sche:string[]= Object.keys(scheduleList.checked_num).filter((key: string) => {
        return scheduleList.checked_num[key] === Math.max(...checked_mem_num);
        });    
    const [sortedMemList, setSortedMemList]:[string[], Function] = useState(max_checked_mem_sche.sort((a:string,b:string)=>new Date(a).getTime()-new Date(b).getTime()));

    const [totalMemNum, setTotalMemNum] = useState(totalMem);
    useEffect(()=>{setTotalMemNum(totalMem);},[totalMem]);

    // console.log(scheduleList.checked_num);
    useEffect(()=>{
        if(scheduleList.checked_num){
            checked_mem_num= Object.values(scheduleList.checked_num);
            
            max_checked_mem_sche = Object.keys(scheduleList.checked_num).filter((key: string) => {
            return scheduleList.checked_num[key] === Math.max(...checked_mem_num);
            });    
            console.log("max_checked_mem_sche",max_checked_mem_sche)
            setSortedMemList(max_checked_mem_sche.sort((a:string,b:string)=>new Date(a).getTime()-new Date(b).getTime()));
        }
    }, [scheduleList]);
    
    const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];
    const [showMaxMember, setShowMaxMember] = useState(false);

    let term = 0;
    let mem_term = 0;

    let sortedList:Date[] = [];

    useEffect(()=>{
        sortedList = fixedSchedule.schedule?.sort((a:Date,b:Date)=>new Date(a).getTime()- new Date(b).getTime());
    },[fixedSchedule])

    useEffect(()=>{console.log("confirm",confirm)},[confirm])

    const handleConfirm = async (newSchedule:Date[]) => {

        console.log("handleConfirm", newSchedule)
    
        const state = "CONFIRM";

        // const getDateDiff = (date1:Date, date2:Date) => {
        
        //   if(date1.getMonth() == date2.getMonth()){
        //     return date1.getDate() - date2.getDate();
        //   }
        //   else{
        //     const dayOfMonth = new Date(date2.getFullYear(), date2.getMonth(), 0);
        //     return dayOfMonth.getDate() - date2.getDate() + date1.getDate()
        //   }
          
        // }
    
        // const dateList = eventTimeInfo?.dateList.sort((a:Date,b:Date)=>(new Date(a).getTime()- new Date(b).getTime()))
        // const weekDaySorter:{ [index: string]: number } = { 'Mon':1 , 'Tue':2 , 'Wed':3 , 'Thu':4 , 'Fri':5 , 'Sat':6 ,'Sun':7 , }
        // const sortedSelectedWeekDay = eventTimeInfo?.dayList.sort((a:string,b:string)=>weekDaySorter[a]-weekDaySorter[b])
        
        let fixedMeeting:FixedDate[] | WeeklyFixedDate[] = [];
        const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
        newSchedule.map((sche:Date)=>{
        //   let fixedSche:WeeklyFixedDate | FixedDate;
    
        //   const index = getDateDiff(sche, week ? week_startDate : (dateList as Date[])[0]);
        //   const real_sche = week ? (sortedSelectedWeekDay as DaysOfWeek[])[index] : (dateList as Date[])[index];
          const time = new Date(sche).getHours() + ":" + new Date(sche).getMinutes();
    
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
            if(week){
              (fixedMeeting as WeeklyFixedDate[]).push({day : WEEKDAY[new Date(sche).getDay()] as DaysOfWeek, timeRange:[time]})
            }
            else{
              (fixedMeeting as FixedDate[]).push({date : new Date(sche), timeRange:[time]})
            }
        //   }
          
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
        // console.log(fixedSchedule.schedule);
    }
    
    useEffect(()=>{
        console.log("show showMemberList", showMemberList);
    }, [showMemberList])


  return (
        <div className="z-25 overflow-hidden overflow-x-auto px-5 pt-3 pb-2 bg-[#f8f9fa] rounded ">
          <div className={`flex flex-row`}>
            {width > 768 ? <div className="w-2/4 pr-3 pt-2">
                <div className="pl-2 break-all font-bold">{lang=="ko"? "참여 가능한 사람":"Members"}</div>
                <hr className="border-t-2 my-1 mb-2"/>
                <ul className ={`${scheduleResultCSS.result_scrolling} border-separate px-2 min-h-4`}>
                    {showMember ? scheduleList.member[showDateTime]?.map((member,idx)=>{
                        console.log("show memberlist")
                        return(
                            <li key={idx}>{member}</li>
                        )
                    }):""}

                </ul>
            </div> :""}
            <div className={`${width > 768 ? "w-2/4 grid-column border-l-2" : "w-full grid-row"} mr-1 grid gap-2`}>
                <div className={`w-full mr-1 grid grid-column gap-2 ${width > 768 ? "pl-3":''}`}>
                <div className="pt-2 mr-1">
                    <div className="flex flex-row pl-2 font-bold justify-between items-center">
                        <p>{lang == "ko" ?"최대인원이 참여 가능한 시간대":"Time with the Maximum Number of People"}</p>
                    </div>
                    <hr className="border-t-2 my-1 mb-2"/>
                    <ul className ="px-2 min-h-4">
                        {sortedMemList ? sortedMemList.map((sche, index)=>{
                            // const schedule = new Date(sche);
                            let diffMin = 0;
                            let diffMSec = 0;
                            const schedule:Date = new Date(sche);
                            const post_time:Date = new Date(sortedMemList[index < sortedMemList.length-1 ? index+1:index]);
                            const prev_time:Date = new Date(sortedMemList[index > 0 ? index-1 : index]);
                            if((mem_term == 0) && sortedMemList.length > 1){
                                diffMin = (post_time.getHours()*60 + post_time.getMinutes()) - (schedule.getHours()*60 + schedule.getMinutes());
                                // diffMin = diffMSec / (60 * 1000);
                            }
                            else{
                                diffMin = (schedule.getHours()*60 + schedule.getMinutes()) - (prev_time.getHours()*60 + prev_time.getMinutes());
                                // diffMin = diffMSec / (60 * 1000);
                            }
                            
                            // console.log("diffMin",diffMin);
                            if(diffMin == 30){  
                                mem_term = mem_term + 1;
                                // console.log("sche",sche, mem_term)
                                diffMin = (post_time.getHours()*60 + post_time.getMinutes()) - (schedule.getHours()*60 + schedule.getMinutes());
                                // diffMin = diffMSec / (60 * 1000);
                                if(diffMin == 30){
                                    return;
                                }
                            }

                            let start_sche:Date = new Date(schedule.getTime());
                            let end_sche:Date = new Date(schedule.getTime());
                            // console.log("b", start_sche, mem_term)
                            start_sche.setMinutes(start_sche.getMinutes()-(30*(mem_term != 0 ? mem_term-1 : mem_term)));
                            // console.log(start_sche)
                            end_sche.setMinutes(end_sche.getMinutes()+30);
                            mem_term = 0;
                            return(
                                <li className="bg-[lightgray] px-3 pt-3 pb-2 rounded cursor-pointer" key={index} onClick={()=>{
                                    //show the member name in row
                                    showMaxMember ? setShowMaxMember(false) : setShowMaxMember(true)
                                }}>
                                <div className="flex flex-row gap-1">
                                    <div>
                                        <p className="inline-block">{(week ? "" : start_sche.toLocaleDateString('ko-KR')) + '(' + WEEKDAY[start_sche.getDay()] + ')'}</p>
                                        <p className="inline-block ml-0.5">{start_sche.toLocaleTimeString('ko-KR')}</p>
                                        <div className="inline-block mx-1"> ~ </div>
                                        <p className="inline-block">{(week ? "" : start_sche.getUTCDate() == end_sche.getUTCDate() ? "" : (end_sche.toLocaleDateString('ko-KR')) + '(' + WEEKDAY[end_sche.getDay()] + ')')}</p>
                                        <p className="inline-block ml-0.5">{end_sche.toLocaleTimeString('ko-KR')}</p>
                                        <p className="inline-block ml-2 text-[red] font-bold">{'(' + (Math.max(...checked_mem_num)*totalMemNum) + '/' + totalMemNum + ')'}</p>
                                    </div>
                                    {showMaxMember ? <FaAngleUp/> : <FaAngleDown/>}
                                </div>
                                <div>
                                        {showMaxMember ? <div className="w-inherit p-2">
                                            <hr className="border-black my-1 mb-2"/>
                                            {lang=="ko" ? "멤버":"Members"} : {scheduleList.member[sche.toString().replace("대한민국", "한국")]?.toString().replaceAll(",", ", ")}
                                        </div> :""}
                                </div>
                                </li>
                            )
                        }):""}
                    </ul>
                </div>
            </div>
                
            <div className={`w-full pb-2 pt-2 mr-1 grid grid-column gap-2 ${width > 768 ? "pl-3" : "border-l-3"}`}>            
            <div className="pt-2 mr-1">
                <div className="pl-2 font-bold justify-between items-center">
                    <p>{lang == "ko" ?"확정된 일정":"Fixed Schedule"}</p>
                </div>
                <hr className="border-t-2 my-1 mb-2"/>
                <ul className ={`px-2 min-h-6 grid grid-column gap-1 ${scheduleResultCSS.result_scrolling2}`}>
                    {sortedList.length > 0 ? sortedList.map((sche:Date, index)=>{
                            let diffMin = 0;
                            let diffMSec = 0;
                            const schedule:Date = new Date(sche.getTime());
                            const post_time:Date = fixedSchedule.schedule[index < fixedSchedule.schedule.length-1 ? index+1:index];
                            const prev_time:Date = fixedSchedule.schedule[index > 0 ? index-1 : index];
                            if((term == 0) && fixedSchedule.schedule.length > 1){
                                diffMin = (post_time.getHours()*60 + post_time.getMinutes()) - (schedule.getHours()*60 + schedule.getMinutes());
                                // diffMin = diffMSec / (60 * 1000);
                            }
                            else{
                                diffMin = (schedule.getHours()*60 + schedule.getMinutes()) - (prev_time.getHours()*60 + prev_time.getMinutes());
                                // diffMin = diffMSec / (60 * 1000);
                            }
                            
                            // console.log("diffMin",diffMin);
                            if(diffMin == 30){  
                                term = term + 1;
                                // console.log("sche",sche, term)
                                diffMin = (post_time.getHours()*60 + post_time.getMinutes()) - (schedule.getHours()*60 + schedule.getMinutes());
                                // diffMin = diffMSec / (60 * 1000);
                                if(diffMin == 30){
                                    return;
                                }
                            }

                            let start_sche:Date = new Date(schedule.getTime());
                            let end_sche:Date = new Date(schedule.getTime());
                            // console.log("b", start_sche, term)
                            start_sche.setMinutes(start_sche.getMinutes()-(30*(term != 0 ? term-1 : term)));
                            // console.log(start_sche)
                            end_sche.setMinutes(end_sche.getMinutes()+30);
                            term = 0;
                            return(
                                <li className="bg-[lightgray] px-3 pt-3 pb-2 rounded cursor-pointer" onClick={()=>{
                                    //show the member name in row
                                    // showMember ? setShowMemberList(false) : setShowMemberList(true)
                                }}>
                            
                                    <p className="inline-block">{(week ? "" : start_sche.toLocaleDateString('ko-KR')) + '(' + WEEKDAY[start_sche.getDay()] + ')'}</p>
                                    <p className="inline-block ml-0.5">{start_sche.toLocaleTimeString('ko-KR')}</p>
                                    <div className="inline-block mx-1"> ~ </div>
                                    <p className="inline-block">{(week ? "" : end_sche.toLocaleDateString('ko-KR')) + '(' + WEEKDAY[end_sche.getDay()] + ')'}</p>
                                    <p className="inline-block ml-0.5">{end_sche.toLocaleTimeString('ko-KR')}</p>
                                    
                                    {/* <p className="inline-block ml-2 text-[red] font-bold">{'(' + (Math.max(...checked_mem_num)*totalMemNum) + '/' + totalMemNum + ')'}</p> */}
                                    {/* {showMemberList ? <p>
                                        <hr className="border-black my-1 mb-2"/>
                                        멤버 : {scheduleList.member[sche].toString()}
                                    </p> :""} */}
                                </li>
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
            {isHost ? select ? "" : ( confirm == 0 || confirm == 1) ? <div className={`flex flex-row gap-2 mt-2`}>
            <div className={`w-full p-2 pt-3 rounded hover:font-bold ${confirm == 1 ? "bg-[#ced4da]": select==1? "bg-[#868e96]" : "bg-[darkgray]"} cursor-pointer text-center`}
                onClick={()=>{
                    // console.log(fixedSchedule.schedule);
                    // console.log(confirm)

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
                    {/* {confirm == 1 ? "일정 확정완료" : select==1 ? "일정 수정하기" : "일정 확정하기"} */}
                </div>
                </div> :"": ""}
                {/* {select == 1 ?
                <div className={`w-full p-2 pt-3 rounded hover:font-bold ${confirm == 1 ? "bg-[#ced4da]": select==1? "bg-[#868e96]" : "bg-[darkgray]"} cursor-pointer text-center`}
                    onClick={()=>{
                        setConfirm(0);
                        setSelect(0);
                        setFixedSchedule({schedule:[]});
                    }}>
                    일정 확정 취소
                </div>:""} */}
            {/* </div> */}
        </div>
  );
});

export default React.memo(ScheduleResultBottom);
