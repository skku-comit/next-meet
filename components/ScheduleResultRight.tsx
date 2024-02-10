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

const ScheduleResultRight = ({setShowResult, showResult,showMember, scheduleList, totalMem}:MyComponentProps) => {
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
          </div>
        </div>
  );
};

export default ScheduleResultRight;
