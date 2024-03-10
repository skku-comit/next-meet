import { NextMeetEvent } from "@/template/Event";
import { ReactNode, useEffect, useState } from "react";
import EventBlock from "./EventBlock";
import { language } from "../lib/recoil/language";
import { useRecoilState } from "recoil";
import { useSession } from "next-auth/react";
import { getEvent } from "@/lib/functions/CRUD";

const EventList = (): ReactNode => {
  const [lang, setLang] = useRecoilState(language);
  const { data: session } = useSession();
  const [eventList, setEventList] = useState<NextMeetEvent[]>([]);

  const getEventList = async () => {
    const eventList: NextMeetEvent[] = [];
    
    try {
      if (session && session.user) {
        const eventIDPromises = session.user.eventIDList.map(async (eventID: string) => {
          const event = await getEvent(eventID);
          if (event) eventList.push(event);
        });
  
        // Wait for all promises to resolve after the map has been executed
        await Promise.all(eventIDPromises);
      }
    } catch (error) {
      console.error("Error fetching event list:", error);
    }
    console.log(eventList);
    setEventList(eventList);
  };


  useEffect(() => {
    if (session && session.user) {
      getEventList();
    }
  }, [session, session?.user]);


  return (
    <div className="w-screen flex justify-center">
      <div className="(eventlist container) w-full lg:mx-20 mx-10 p-5 h-fit bg-slate-100 rounded-2xl">
        <p className="text-xl">
          {lang == "ko" ? "진행중인 이벤트" : "Events in Progress"}
        </p>
        <div className="p-2 py-4 grid lg:grid-cols-4 gap-6">
          {eventList
            .filter((item) => item.fixedMeeting.length === 0)
            .map((item, idx) => (
              <EventBlock event={item} key={idx} />
            ))}
        </div>
        <p className="text-xl mt-8">
          {lang == "ko" ? "종료된 이벤트" : "Terminated Events"}
        </p>
        <div className="p-2 py-4 grid lg:grid-cols-4 gap-6">
          {eventList
            .filter((item) => item.fixedMeeting.length !== 0)
            .map((item, idx) => (
              <EventBlock event={item} key={idx} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default EventList;
