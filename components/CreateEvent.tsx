import { ReactNode, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import CalendarInput from "./CalendarInput";
import TimeInput from "./TimeInput";
import { className_button } from "@/styles/button";

const CreateEvent = ():ReactNode =>{
    const [isCreatingEvent,setIsCreatingEvent] = useState<boolean>(false);

    return <div className="w-screen h-max flex flex-col items-center">
        {!isCreatingEvent && <button className={`(New Event Button) ${className_button} mt-60 text-2xl flex items-center`}
          onClick={(e)=>{
            e.preventDefault();
            setIsCreatingEvent(true)
          }}>
          <IoMdAddCircleOutline className="mr-2 w-8 h-8"/>
          Create New Event</button>}

        {isCreatingEvent && <div className="w-screen mt-10 flex flex-col items-center">
          <CalendarInput/>
          <TimeInput/>
          <button className={`${className_button} text-xl`}
            onClick={()=>{}}>
            Proceed!  
            </button>
        </div>}

    </div>
}
export default CreateEvent;