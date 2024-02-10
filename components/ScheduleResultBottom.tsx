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
}

const ScheduleResultBottom = ({setShowResult, showResult,showMember, scheduleList, totalMem}:MyComponentProps) => {
    let checked_mem_num: number[] = [];
    let max_checked_mem_sche:string[]=[];

    const [totalMemNum, setTotalMemNum] = useState(totalMem);
    useEffect(()=>{setTotalMemNum(totalMem); console.log(totalMem)},[totalMem]);

    console.log(scheduleList.checked_num);
    if(scheduleList.checked_num){
        checked_mem_num= Object.values(scheduleList.checked_num);
        
        max_checked_mem_sche = Object.keys(scheduleList.checked_num).filter((key: string) => {
        return scheduleList.checked_num[key] === Math.max(...checked_mem_num);
        });    
    }
    
    const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];
    const [showMaxMember, setShowMaxMember] = useState(false);

  return (
        <div className="overflow-hidden overflow-x-auto px-5 pt-3 pb-2 bg-[#f8f9fa] rounded">
          <div className={`flex flex-row`}>
            <div className="w-2/4 pr-3 pt-2">
                <div className="pl-2 break-all font-bold">Members</div>
                <hr className="border-t-2 my-1 mb-2"/>
                <ul className ={`${scheduleResultCSS.result_scrolling} border-separate px-2 min-h-4`}>
                    {showMember ? showMember.map((member)=>{
                        return(
                            <li>{member}</li>
                        )
                    }):""}
                </ul>
            </div>
            <div className="w-2/4 pl-3 pt-2 border-l-2 mr-1">
                <div className="flex flex-row pl-2 font-bold justify-between items-center">
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
                                <p className="inline-block">{schedule.toLocaleDateString('ko-KR') + '(' + WEEKDAY[schedule.getDay()] + ')'}</p>
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
            <div>
                <IoMdClose className={`${scheduleResultCSS.closeBtn} fixed right-0.5 cursor-pointer`} 
                    onClick={()=>{setShowResult(false)}}/>
            </div>
          </div>
        </div>
  );
};

export default ScheduleResultBottom;
