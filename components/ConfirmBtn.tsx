import scheduleResultCSS from "@/styles/scheduleResult.module.css";
import React, {useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

interface MyComponentProps {
    // fixedDate:Date[]|WeeklyFixedDate[] | null;
    confirm : number;
    select : number,
    setConfirm : Function;
    setSelect : Function;
    fixedSchedule:{schedule:[]};
    setFixedSchedule:Function;
}

const ConfirmBtn = ({select, setSelect, confirm, setConfirm, fixedSchedule, setFixedSchedule }:MyComponentProps) => {

  return (
    <div className={`flex flex-column gap-2 p-5 py-4 fixed w-full bg-[white] z-10`}>
    <div className={`w-full p-2 pt-3 rounded hover:font-bold ${confirm == 1 ? "bg-[#ced4da]": select==1? "bg-[#868e96]" : "bg-[gray]"} cursor-pointer text-center`}
        onClick={()=>{
            // console.log(fixedSchedule.schedule);
            // console.log(confirm)

            if(confirm == 0 || confirm == 2){
                setConfirm(1);
                setSelect(0);
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
            {confirm==1 ? "일정 수정완료" : "일정 수정하기"}
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
  );
};

export default ConfirmBtn;
