import { DaysOfWeek } from "@/template/DaysOfWeek";
import { ReactNode } from "react";

const DAYS:DaysOfWeek[] = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DAYSkor = ['월','화','수','목','금','토','일'];
type DaysPickerProps = {
    onClickDay:(value:DaysOfWeek)=>void,
    selectedDays:DaysOfWeek[]
}

const DaysPicker = ({onClickDay,selectedDays}:DaysPickerProps): ReactNode => {
  return (
    <div className="w-[70%] max-w-full h-[50px] m-8 bg-[#ffe7e7]">
      <ul className="flex">
        {DAYS.map((day,idx)=>
          <li className={`w-full text-center p-3 cursor-pointer ${selectedDays.includes(day,0) && 'bg-[#FFC5C5]'}`}
            key={idx}
            onClick={()=>{
              onClickDay(day);}}
            >{DAYSkor[idx]}</li>)}
      </ul>
    </div>
  );
};


export default DaysPicker;