import { ReactNode, useRef } from "react";

type TimeInputProps = {
  onStartTimeChange:(startTime:string)=>void;
  onEndTimeChange:(endTime:string)=>void;
}

const TimeInput = ({onStartTimeChange,onEndTimeChange}:TimeInputProps): ReactNode => {
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);
 
  return (
    <div className="w-screen h-max p-10 flex flex-col items-center ">
      <p className="text-2xl">Enter approximate time</p>
      <div className="p-8 pb-4 flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <label>from</label>
          <input 
            type="time" 
            className="w-32 border-[1px]" 
            ref={startTimeRef} 
            onChange={(e)=>onStartTimeChange(e.target.value)}></input>
        </div>
        <div className="flex items-center gap-2">
          <label>to</label>
          <input 
            type="time" 
            className="w-32 border-[1px]" 
            ref={endTimeRef}
            onChange={(e)=>onEndTimeChange(e.target.value)}></input>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" onChange={(e)=>{
          if(e.target.checked){
            startTimeRef.current!.value = '00:00';
            endTimeRef.current!.value = '00:00';
            startTimeRef.current!.disabled = true;
            endTimeRef.current!.disabled = true;
          }
          else{
            startTimeRef.current!.disabled = false;
            endTimeRef.current!.disabled = false;
          }
        }}></input>
        <label>All Day</label>
      </div>
    </div>
  );
};

export default TimeInput;
