import { ReactNode, useEffect, useState } from "react";
import EventList from "@/components/EventList";
import Login from "@/components/Login";
import { signOut, useSession } from "next-auth/react";
import { NextMeetEvent } from "@/template/Event";
import { getEvent } from "@/lib/functions/CRUD";

const LogoutButton = (): ReactNode => {
  return (
    <button
      className="mt-auto pt-20 hover:underline underline-offset-[6px]"
      onClick={(e) => {
        e.preventDefault();
        signOut({ redirect: false });
      }}>
      로그아웃
    </button>
  );
};


const MyPage = (): ReactNode => {
  const { data: session } = useSession();
  console.log( session );
  const [eventList,setEventList] = useState<NextMeetEvent[]>([]);
  
  useEffect(()=>{
    if(session && session.user){
      getEventList();
    }
  },[session]);

  const getEventList = async () => {
    const eventList: NextMeetEvent[] = [];
    
    const eventIDPromises = session!.user.eventIDList.map(async (eventID: string) => {
      const event = await getEvent(eventID);
      if (event) eventList.push(event);
    });
  
    // Wait for all promises to resolve
    await Promise.all(eventIDPromises);
  
    setEventList(eventList);
  }

  return (
    <div className="flex-grow lg:p-20 pb-10 h-fit flex flex-col items-center justify-center">
      {!(session && session.user) ? (
        <Login />
      ) : (
        <>
          <p className="text-2xl self-center lg:self-start p-10 lg:p-5">{session.user.name} 님의</p>
          <EventList eventList={eventList}/>
          <LogoutButton />
        </>
      )}
    </div>
  );
};

export default MyPage;
