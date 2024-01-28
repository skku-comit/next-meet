import { ReactNode, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import CalendarComponent from "./Calendar";

const CreateEvent = ():ReactNode =>{
    const [isCreatingEvent,setIsCreatingEvent] = useState<boolean>(false);

    return <div className="w-screen h-max flex flex-col items-center">
        {!isCreatingEvent && <div className="(New Event Button) p-6 py-3 mt-60 text-2xl bg-[#ffadad] rounded-xl text-white cursor-pointer flex items-center"
          onClick={()=>{setIsCreatingEvent(true)}}>
          <IoMdAddCircleOutline className="mr-2 w-8 h-8"/>
          Create New Event</div>}

        {isCreatingEvent && <div className="w-screen">
          <CalendarComponent/>
        </div>}

    </div>
}
export default CreateEvent;