import { NextMeetEvent } from "@/template/Event";
import { ReactNode } from "react";

const EventBlock = ({event}:{event:NextMeetEvent}):ReactNode =>{


    return (
    <div className="bg-[#ffd5d5] rounded-xl p-6">
      <h1 className="text-xl">{event.eventName}</h1>
    </div>);
}

export default EventBlock;