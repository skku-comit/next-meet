import scheduleResultCSS from "@/styles/scheduleResult.module.css";
import React, {useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

interface MyComponentProps {
    // fixedDate:Date[]|WeeklyFixedDate[] | null;
    showResult:boolean;
    setShowResult:Function;
    showMember:[];
    scheduleList : {checked_num:{[key:string]:number}, member:{[key:string]:string[]}};
    totalMem:number;
    confirm : number;
    select : number,
    setConfirm : Function;
    setSelect : Function;
    fixedSchedule:{schedule:[]};
    setFixedSchedule:Function;
    week:boolean
}

const ScheduleResultRight = ({setShowResult, showResult,showMember, scheduleList, totalMem,
    select, setSelect, confirm, setConfirm, fixedSchedule, setFixedSchedule, week }:MyComponentProps) => {
    let checked_mem_num: number[] = [];
    let max_checked_mem_sche:string[]=[];

    const [totalMemNum, setTotalMemNum] = useState(totalMem);
    useEffect(()=>{setTotalMemNum(totalMem);},[totalMem]);

    // console.log(scheduleList.checked_num);
    if(scheduleList.checked_num){
        checked_mem_num= Object.values(scheduleList.checked_num);
        
        max_checked_mem_sche = Object.keys(scheduleList.checked_num).filter((key: string) => {
        return scheduleList.checked_num[key] === Math.max(...checked_mem_num);
        });    
    }
    
    const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];
    const [showMaxMember, setShowMaxMember] = useState(false);
    const [showMemberList, setShowMemberList] = useState(false);

    let term:number = 0;

  return (
    <div className="flex flex-col gap-3 overflow-hidden overflow-x-auto place-self-start">
        <div className="p-5 bg-[#f8f9fa] rounded place-self-start w-full">
            <div className="">
                <div className="pl-2 break-all font-bold">Members</div>
                <hr className="border-t-2 my-1 mb-2"/>
                <ul className ={`${scheduleResultCSS.result_height} border-separate px-2 min-h-4`}>
                    {showMember ? showMember.map((member)=>{
                        return(
                            <li>{member}</li>
                        )
                    }):""}
                </ul>
            </div>
        </div>
        <div className="p-5 bg-[#f8f9fa] rounded place-self-start">            
            <div className="pt-2 mr-1">
                <div className="pl-2 font-bold justify-between items-center">
                    <p>가장 많은 멤버가 참여 가능한 시간대</p>
                </div>
                <hr className="border-t-2 my-1 mb-2"/>
                <ul className ="px-2 min-h-4">
                    {max_checked_mem_sche ? max_checked_mem_sche.map((sche)=>{
                        const schedule = new Date(sche);
                        return(
                            <li className="bg-[lightgray] px-3 pt-3 pb-2 rounded cursor-pointer" onClick={()=>{
                                //show the member name in row
                                showMaxMember ? setShowMaxMember(false) : setShowMaxMember(true)
                            }}>
                                <p className="inline-block">{(week ? "" : schedule.toLocaleDateString('ko-KR')) + '(' + WEEKDAY[schedule.getDay()] + ')'}</p>
                                <p className="inline-block ml-2">{schedule.toLocaleTimeString('ko-KR')}</p>
                                <p className="inline-block ml-2 text-[red] font-bold">{'(' + (Math.max(...checked_mem_num)*totalMemNum) + '/' + totalMemNum + ')'}</p>
                                {showMaxMember ? <p>
                                    <hr className="border-black my-1 mb-2"/>
                                    멤버 : {scheduleList.member[sche].toString()}
                                </p> :""}
                            </li>
                        )
                    }):""}
                </ul>
            </div>
        </div>
        <div className="w-full p-5 bg-[#f8f9fa] rounded place-self-start">            
            <div className="pt-2 mr-1">
                <div className="pl-2 font-bold justify-between items-center">
                    <p>확정된 일정</p>
                </div>
                <hr className="border-t-2 my-1 mb-2"/>
                <ul className ={`px-2 min-h-6 grid grid-column gap-1 ${scheduleResultCSS.result_scrolling2}`}>
                    {fixedSchedule.schedule.map((sche, index)=>{
                        let diffMin = 0;
                        let diffMSec = 0;
                        const schedule = new Date(sche);
                        if(index == 0 && fixedSchedule.schedule.length > 1){
                            const post_time = new Date(fixedSchedule.schedule[index+1]);
                            diffMSec = post_time.getTime() - schedule.getTime();
                        }
                        else if(index != 0 && index != fixedSchedule.schedule.length-1){
                            const prev_time = new Date(fixedSchedule.schedule[index-1]);
                            diffMSec = schedule.getTime() - prev_time.getTime();
                        }
                        diffMin = diffMSec / (60 * 1000);
                        if(diffMin == 30){   
                            term++;
                            return;
                        }
                        const start_sche = new Date(fixedSchedule.schedule[index-term]);
                        term = 0;
                        return(
                            <li className="bg-[lightgray] px-3 pt-3 pb-2 rounded cursor-pointer" onClick={()=>{
                                //show the member name in row
                                // showMember ? setShowMemberList(false) : setShowMemberList(true)
                            }}>
                                {schedule != start_sche ? <span>
                                    <p className="inline-block">{(week ? "" : start_sche.toLocaleDateString('ko-KR')) + '(' + WEEKDAY[start_sche.getDay()] + ')'}</p>
                                    <p className="inline-block ml-2">{start_sche.toLocaleTimeString('ko-KR')}</p>
                                    <div>~</div>
                                </span>:""}
                                
                                <p className="inline-block">{(week ? "" : schedule.toLocaleDateString('ko-KR')) + '(' + WEEKDAY[schedule.getDay()] + ')'}</p>
                                <p className="inline-block ml-2">{schedule.toLocaleTimeString('ko-KR')}</p>

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
        <div className={`mt-4 flex flex-column gap-2`}>
            <div className={`w-full p-2 pt-3 rounded hover:font-bold ${confirm == 1 ? "bg-[#ced4da]": select==1? "bg-[#868e96]" : "bg-[darkgray]"} cursor-pointer text-center`}
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
                            console.log(fixedSchedule.schedule.length);
                        }
                    
                    }
                }}>
                    {confirm == 1 ? "일정 확정완료" : select==1 ? "일정 수정하기" : "일정 확정하기"}
                </div>
                {select == 1 ?
                <div className={`w-full p-2 pt-3 rounded hover:font-bold ${confirm == 1 ? "bg-[#ced4da]": select==1? "bg-[#868e96]" : "bg-[darkgray]"} cursor-pointer text-center`}
                    onClick={()=>{
                        setConfirm(0);
                        setSelect(0);
                        setFixedSchedule({schedule:[]});
                    }}>
                    일정 확정 취소
                </div>:""}
            </div>
        </div>
  );
};

export default ScheduleResultRight;
