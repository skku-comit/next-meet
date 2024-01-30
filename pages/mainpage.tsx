import CreateEvent from "@/components/CreateEvent";
import EventList from "@/components/EventList";
import Login from "@/components/Login";
import { ReactNode } from "react";


const MainPage = ():ReactNode =>{


    return <div className="w-screen h-full min-h-screen ">
        <div className="(header space) w-screen h-20"></div>
        <CreateEvent/>
        <Login/>
        <EventList/>
    </div>
}

export default MainPage;