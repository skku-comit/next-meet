import { ReactNode, useRef, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import CalendarInput from "./CalendarInput";
import TimeInput from "./TimeInput";
import { className_button } from "@/styles/button";
import { v4 as uuidv4 } from 'uuid'
import { DateSelection } from "@/template/DateSelection";
import { DaysOfWeek } from "@/template/DaysOfWeek";

const CreateEvent = ():ReactNode =>{
    //useState
    const [isCreatingEvent,setIsCreatingEvent] = useState<boolean>(false);
    const [dateSelection,setDateSelection] = useState<DateSelection>({isWeekly:false,dateList:[]});
    const [startTime,setStartTime] = useState<string|''>('');
    const [endTime,setEndTime] = useState<string|''>('');
    const [canProceed,setCanProceed] = useState<boolean>(false);

    //useRefs
    const hostIDRef = useRef<HTMLInputElement>(null);
    const hostPWRef = useRef<HTMLInputElement>(null);

    //functions
    const onProceed = () =>{
      //generate unique id for an event
      const uniqueID = uuidv4().replaceAll('-','');
      console.log(uniqueID);
    }
    const dateClickHandler = (value: Date | DaysOfWeek) => {
      if(dateSelection.isWeekly){ //week mode
        if(value instanceof Date) setDateSelection({isWeekly:false,dateList:[value]});
          else{
            if (!dateSelection.dateList.includes(value)){
              setDateSelection(prev => (
                {isWeekly:true,dateList:[...prev.dateList as DaysOfWeek[],value]})); // add new date
            } else {
              setDateSelection(prev => ({isWeekly:true,dateList:(prev.dateList as DaysOfWeek[]).filter(date => date!== value)})); // remove date
            }
          };
        }
        else{ //specific days mode
          if(value instanceof Date){
            if (dateSelection.dateList.find(date => date.getTime() === value.getTime()) === undefined) {
              setDateSelection(prev => ({isWeekly:false,dateList:[...prev.dateList as Date[], value]})); // add new date
          } else {
              setDateSelection(prev=>({isWeekly:false,dateList:(prev.dateList as Date[]).filter(date => date.getTime() !== value.getTime())})); // remove date
          }
          }
          else setDateSelection({isWeekly:true,dateList:[value]});
        }
      };

    const onToggleDateMode = (isWeekly:boolean) =>{
      isWeekly ? setDateSelection({isWeekly:true, dateList:[]}) : setDateSelection({isWeekly:false,dateList:[]});
    }
    const proceedCheck = () =>{
      if(!hostIDRef.current || !hostPWRef.current) return;
      if(hostIDRef.current.value.trim().length > 2 
        && hostPWRef.current.value.trim().length > 4
        ) setCanProceed(true);
      else setCanProceed(false); 
    }

    const onStartTimeChange = (startTime:string) =>{
      setStartTime(startTime);
    }

    const onEndTimeChange = (endTime:string) =>{
      setEndTime(endTime);
    }

    return <div className="w-screen h-max mb-40 flex flex-col items-center">
        {!isCreatingEvent && <button className={`(New Event Button) ${className_button} mt-60 text-2xl flex items-center`}
          onClick={(e)=>{
            e.preventDefault();
            setIsCreatingEvent(true);
          }}>
          <IoMdAddCircleOutline className="mr-2 w-8 h-8"/>
          Create New Event</button>}

        {isCreatingEvent && <div className="w-screen mt-10 flex flex-col items-center">
          <CalendarInput 
            onToggleDateMode={onToggleDateMode} 
            onClickDate={dateClickHandler}
            selectedDates={dateSelection}/>
          <TimeInput
            onStartTimeChange={onStartTimeChange}
            onEndTimeChange={onEndTimeChange}
            />
          <p className="mt-16 text-2xl">Not member yet?</p>
          <div className="m-8 mb-24 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <label className="w-32 text-center">호스트 이름<br/>Host Name</label>
              <input className="border-[1px] py-1 indent-2 indent outline-none rounded-md" 
              type='text'
              ref={hostIDRef}
              onChange={proceedCheck}
              ></input>
            </div>
            <div className="flex items-center gap-2">
              <label className="w-32 text-center">비밀번호<br/>PW</label>
              <input className="border-[1px] py-1 indent-2 outline-none rounded-md" 
              type='password'
              ref={hostPWRef}
              onChange={proceedCheck}
              ></input>
            </div>
          </div>
          
          <button className={`${className_button} text-xl mb-10 ${!canProceed && 'bg-gray-300 cursor-auto'}`}
            onClick={canProceed ? onProceed : ()=>{}}>
            Proceed!  
            </button>
        </div>}

    </div>
}
export default CreateEvent;