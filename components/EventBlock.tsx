'use client';
import { NextMeetEvent } from "@/template/Event";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { FaCrown } from "react-icons/fa6";

const EventBlock = ({ event }:{event:NextMeetEvent}):ReactNode =>{
    const router = useRouter();
    const { data: session } = useSession();
    const isHost = session!.user!.userID === event.hostUserInfo.userID;

    return (
    <div className={`${event.fixedMeeting.length === 0 ? 'bg-[#ffd5d5] hover:bg-[#fac1c1]' : 'bg-[#dcdcdc] hover:bg-[#c8c8c8]'} rounded-xl p-6 cursor-pointer `}
      onClick={()=>router.push(`event/${event.eventID}`)}>
      <div className="flex items-center">
        <h1 className="text-xl">{event.eventName}</h1>
        {isHost && <FaCrown className="h-6 w-6 ml-2"/>}
      </div>
      <h1 className="text-[1rem] mt-2">{event.description}</h1>
    </div>);
}

export default EventBlock;