import scheduleResultCSS from "@/styles/scheduleResult.module.css";
import { FixedDate, WeeklyFixedDate } from "@/template/WeeklyFixedDate";
import { DaysOfWeek } from "@/template/DaysOfWeek";
import { useSearchParams } from "next/navigation";
import React, {useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { language } from '../lib/recoil/Language';
import { useRecoilState } from "recoil";
import { handleConfirm } from "@/lib/functions/handleConfirm";

interface MyComponentProps {
    // fixedDate:Date[]|WeeklyFixedDate[] | null;
    week : boolean;
    confirm : number;
    select : number,
    setConfirm : Function;
    setSelect : Function;
    fixedSchedule:{schedule:Date[]};
    setFixedSchedule:Function;
    eventID:number;
    setPreFixedSchedule:Function;
}

const ConfirmBtn = ({week, select, setSelect, confirm, setConfirm, fixedSchedule, setFixedSchedule, eventID, setPreFixedSchedule}:MyComponentProps) => {

    const [lang, setLang] = useRecoilState(language);
  
    // const handleConfirm = async (newSchedule:Date[]) => {

    //     console.log("handleConfirm", newSchedule)

    //     const state = "CONFIRM";

    //     let fixedMeeting:FixedDate[] | WeeklyFixedDate[] = [];
    //     const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    //     newSchedule.map((sche:Date)=>{
    //         const time = new Date(sche).getHours() + ":" + new Date(sche).getMinutes();

    //         if(week){
    //           (fixedMeeting as WeeklyFixedDate[]).push({day : WEEKDAY[new Date(sche).getDay()] as DaysOfWeek, timeRange:[time]})
    //         }
    //         else{
    //           (fixedMeeting as FixedDate[]).push({date : new Date(sche), timeRange:[time]})
    //         }
    //     //   }
          
    //     })

    //     console.log("FixedMeeting", fixedMeeting)

    //     try {
    //       const res = await fetch("http://localhost:3000/api/form", {
    //         method: "PATCH",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({      
    //           eventID, fixedMeeting, state
    //         }),
    //       });
    //       console.log(res);
    //       const data = await res.json();
    //       console.log(data);
    //     } catch (error) {
    //       console.log(error);
    //     } 

    //     setPreFixedSchedule({schedule:[newSchedule]});
    //     // console.log(fixedSchedule.schedule);
    // }


    return (
      <div className={`flex flex-column gap-2 p-5 py-4 fixed top-20 left-0 right-0 w-full bg-[white] border-0 z-30`}>
      <div className={`w-full p-2 pt-3 rounded hover:font-bold ${confirm == 1 ? "bg-[#ced4da]": select==1? "bg-[#868e96]" : "bg-[gray]"} cursor-pointer text-center`}
          onClick={()=>{
              // console.log(fixedSchedule.schedule);
              // console.log(confirm)

              if(confirm == 0 || confirm == 2){
                setConfirm(3);
                setSelect(0);
              }
              else if(confirm == 3){ //edit 중
                setConfirm(2); 
                handleConfirm(fixedSchedule.schedule, week, eventID, setPreFixedSchedule);
                console.log(fixedSchedule.schedule);

                if(fixedSchedule.schedule.length > 0){
                    setSelect(1); 
                    console.log(fixedSchedule.schedule.length);
                }
                else{
                  setConfirm(0);
                }
            
            }
        }}>
            {confirm==3 ? lang == "ko" ? "수정완료" : "Schedule Modification Completed": lang == "ko" ? "확정된 일정 수정하기" : "Edit a Confirmed Schedule"}
        </div>
        {select == 1 ?
        <div className={`w-full p-2 pt-3 rounded hover:font-bold ${confirm == 1 ? "bg-[#ced4da]": select==1? "bg-[#868e96]" : "bg-[darkgray]"} cursor-pointer text-center`}
            onClick={async ()=>{
                handleConfirm([], week, eventID, setPreFixedSchedule);                
                setConfirm(0);
                setSelect(0);
                setFixedSchedule({schedule:[]});
            }}>
            {lang =="ko" ? "일정 확정 취소" : "Cancel confirmed schedule"}
        </div>:""}
    </div>
  );
};

export default ConfirmBtn;
