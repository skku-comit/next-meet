import scheduleResultCSS from "@/styles/scheduleResult.module.css";
import React, {useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { throttle } from "lodash";


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
    fixedSchedule:{schedule:Date[]};
    setFixedSchedule:Function;
    week: boolean;
    isLogin:boolean;
    width:number;
}

const ScheduleResultBottom = React.memo(function ScheduleResultBottom({width, setShowResult, showResult,showMember, scheduleList, totalMem,
    select, setSelect, confirm, setConfirm, fixedSchedule, setFixedSchedule, week, isLogin }:MyComponentProps) {
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

    let term = 0;
    let mem_term = 0;

    let sortedList:Date[] = [];

    useEffect(()=>{
        sortedList = fixedSchedule.schedule.sort((a:Date,b:Date)=>a.getTime()-b.getTime());
    },[fixedSchedule])

    let sortedMemList:string[] = [];

    useEffect(()=>{
        sortedMemList = max_checked_mem_sche.sort((a:string,b:string)=>new Date(a).getTime()-new Date(b).getTime());
    },[max_checked_mem_sche])


  return (
        <div className="z-25 overflow-hidden overflow-x-auto px-5 pt-3 pb-2 bg-[#f8f9fa] rounded ">
          <div className={`flex flex-row`}>
            {width > 768 ? <div className="w-2/4 pr-3 pt-2">
                <div className="pl-2 break-all font-bold">Members</div>
                <hr className="border-t-2 my-1 mb-2"/>
                <ul className ={`${scheduleResultCSS.result_scrolling} border-separate px-2 min-h-4`}>
                    {showMember ? showMember.map((member,idx)=>{
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
                        <p>가장 많은 멤버가 참여 가능한 시간대</p>
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
                                        <p className="inline-block">{(week ? "" : end_sche.toLocaleDateString('ko-KR')) + '(' + WEEKDAY[end_sche.getDay()] + ')'}</p>
                                        <p className="inline-block ml-0.5">{end_sche.toLocaleTimeString('ko-KR')}</p>
                                        <p className="inline-block ml-2 text-[red] font-bold">{'(' + (Math.max(...checked_mem_num)*totalMemNum) + '/' + totalMemNum + ')'}</p>
                                    </div>
                                    {showMaxMember ? <FaAngleUp/> : <FaAngleDown/>}
                                </div>
                                <div>
                                        {showMaxMember ? <p>
                                            <hr className="border-black my-1 mb-2"/>
                                            멤버 : {scheduleList.member[sche.toLocaleString()].toString()}
                                        </p> :""}
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
                    <p>확정된 일정</p>
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
            {isLogin && select ? "" : <div className={`flex flex-row gap-2 mt-2`}>
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
                    {confirm == 1 ? "일정 확정완료" : "일정 확정하기"}
                    {/* {confirm == 1 ? "일정 확정완료" : select==1 ? "일정 수정하기" : "일정 확정하기"} */}
                </div>
                </div>}
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
