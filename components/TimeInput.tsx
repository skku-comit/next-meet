import { ReactNode, useEffect, useRef, useState } from "react";
import TimePicker from "./TimePicker";
import { useRecoilValue } from "recoil";
import { language } from '../lib/recoil/language';

type TimeInputProps = {
  onStartTimeChange:(startTime:string)=>void;
  onEndTimeChange:(endTime:string)=>void;
}

const TimeInput = ({onStartTimeChange,onEndTimeChange}:TimeInputProps): ReactNode => {

  const lang = useRecoilValue(language);
  //useStates
  const [startTime,setStartTime] = useState<{hour:string, min:string}>({hour:"00", min:"00"});
  const [endTime,setEndTime] = useState<{hour:string, min:string}>({hour:"00", min:"00"});
  const [isAllDay,setIsAllDay] = useState<boolean>(false);

  //useEffects
  useEffect(()=>{
    if(isAllDay){
      onStartTimeChange("00:00");
      onEndTimeChange("00:00");
    }
    else{
      onStartTimeChange(startTime.hour+":"+startTime.min);
      onEndTimeChange(endTime.hour+":"+endTime.min);
    }
  },[isAllDay]);

  //functions
  const startTimeClickHandler = (hour: string | null, min: string | null) => {
    if(hour !== null) {
      setStartTime(prev => ({hour:hour, min: prev.min}));
      onStartTimeChange(hour+":"+startTime.min);
    }
    else {
      setStartTime(prev => ({hour: prev.hour, min: min! }));
      onStartTimeChange(startTime.hour+":"+min);
    }
  };

  const endTimeClickHandler = (hour: string | null, min: string | null) => {
    if(hour !== null) {
      setEndTime(prev => ({hour:hour, min: prev.min}));
      onEndTimeChange(hour+":"+endTime.min);
    }

    else {
      setEndTime(prev => ({hour: prev.hour, min: min! }));
      onEndTimeChange(endTime.hour+":"+min);}
  };


 
  return (
    <div className="w-screen h-max p-10 flex flex-col items-center ">
      <p className="text-2xl">{lang === 'ko' ? '시간 선택' : 'Select time'}</p>
      <div className="p-8 pb-4 flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <label>from</label>
            <TimePicker enabled={isAllDay} value={startTime} clickHandler={startTimeClickHandler}/>
        </div>
        <div className="flex items-center gap-2">
          <label>to</label>
          <TimePicker enabled={isAllDay} value={endTime} clickHandler={endTimeClickHandler}/>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" onChange={(e)=>{
          if(e.target.checked) setIsAllDay(true);
          else setIsAllDay(false);
        }}></input>
        <label>{lang === 'ko' ? '하루종일' : 'All Day'}</label>
      </div>
    </div>
  );
};

export default TimeInput;
