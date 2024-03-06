import scheduleResultCSS from "@/styles/scheduleResult.module.css";
import React, {useEffect, useMemo, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { language } from '../lib/recoil/Language';
import { useRecoilState } from "recoil";

interface MyComponentProps {
    // fixedDate:Date[]|WeeklyFixedDate[] | null;
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
}

const ScheduleResultRight = React.memo(function ScheduleResultRight({setShowResult, showResult,showMember, scheduleList, totalMem,
    select, setSelect, confirm, setConfirm, fixedSchedule, setFixedSchedule, week, isLogin, isHost, showMemberList }:MyComponentProps) {
    
    const [lang, setLang] = useRecoilState(language);

    let checked_mem_num: number[] = Object.values(scheduleList.checked_num);
    let max_checked_mem_sche:string[]=Object.keys(scheduleList.checked_num).filter((key: string) => {
        return scheduleList.checked_num[key] === Math.max(...checked_mem_num);
        });    ;
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
    // const [showMemberList, setShowMemberList] = useState(false);

    let term:number = 0;
    let mem_term:number = 0;

    // const [sortedList, setSortedList]:[Date[],Function] = useState([]);
    let sortedList:Date[] = [];


    // useMemo(()=>{
        useEffect(()=>{
            sortedList = fixedSchedule.schedule.sort((a:Date,b:Date)=>a.getTime()-b.getTime());
        },[fixedSchedule])
    // }, [fixedSchedule]);
    

    // const [sortedMemList, setSortedMemList]:[Date[],Function] = useState([]);


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
                        // const schedule = new Date(sche);
                        console.log("sortedMemList Map")
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
                            <li className="bg-[lightgray] px-3 pt-3 pb-2 rounded cursor-pointer" onClick={()=>{
                                //show the member name in row
                                showMaxMember ? setShowMaxMember(false) : setShowMaxMember(true)
                            }} key={index}>
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
                                    {showMaxMember ? <p className="text-gray-600">
                                        <hr className="border-black my-1 mb-2"/>
                                        {lang=="ko" ? "멤버":"Members"} : {scheduleList.member[new Date(sche).toString().replace("대한민국", "한국")]?.toString().replaceAll(",", ", ")}
                                    </p> :""}
                              </div>
                            </li>
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
                        })}
                </ul>
            </div>
        </div>
        {/* <div className={`mt-4 flex flex-column gap-2`}> */}
            {isHost && !select ? <div className={`w-full mt-1 p-2 pt-3 rounded hover:font-bold ${confirm == 1 ? "bg-[#ced4da]": select==1? "bg-[#868e96]" : "bg-[darkgray]"} cursor-pointer text-center`}
                onClick={()=>{
                    // console.log(fixedSchedule.schedule);
                    // console.log(confirm)

                    if(confirm == 0 || confirm == 2){
                        setConfirm(1);
                    }
                    else if(confirm == 1){ //select 중
                        setConfirm(0); 
                        console.log(fixedSchedule.schedule);

                        if(fixedSchedule.schedule.length > 0){
                            setSelect(1); 
                            // console.log(fixedSchedule.schedule.length);
                        }
                    
                    }
                }}>
                    {confirm == 1 ? (lang=="ko" ? "일정 확정완료":"Confirmed Complete") : (lang == "ko" ? "일정 확정하기":"Schedule confirmed")}
                    {/* {confirm == 1 ? "일정 확정완료" : select==1 ? "일정 수정하기" : "일정 확정하기"} */}
                </div>:""}
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

export default React.memo(ScheduleResultRight);
