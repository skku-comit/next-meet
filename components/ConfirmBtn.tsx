import React from "react";
import { language } from '../lib/recoil/language';
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

    return (
      <div className={`flex flex-column gap-2 p-5 py-4 fixed top-20 left-0 right-0 w-full bg-[white] border-0 z-30`}>
      <div className={`w-full p-2 pt-3 rounded hover:font-bold ${confirm == 1 ? "bg-[#ced4da]": select==1? "bg-[#868e96]" : "bg-[gray]"} cursor-pointer text-center`}
          onClick={()=>{

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
