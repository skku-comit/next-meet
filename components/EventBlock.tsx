'use client';
import { NextMeetEvent } from "@/template/Event";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

const EventBlock = ({event}:{event:NextMeetEvent}):ReactNode =>{
    const router = useRouter();
    
    return (
    <div className={`${event.fixedMeeting.length === 0 ? 'bg-[#ffd5d5] hover:bg-[#fac1c1]' : 'bg-[#dcdcdc] hover:bg-[#c8c8c8]'} rounded-xl p-6 cursor-pointer `}
      onClick={()=>router.push(`event/${event.eventID}`)}>
      <h1 className="text-xl">{event.eventName}</h1>
      <h1 className="text-[1rem] mt-2">{event.description}</h1>
    </div>);
}

export default EventBlock;