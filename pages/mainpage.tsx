import CalendarComponent from "@/components/Calendar";
import CreateEvent from "@/components/CreateEvent";
import { ReactNode } from "react";


const MainPage = ():ReactNode =>{


    return <div className="w-screen h-full min-h-screen ">
        <div className="(header space) w-screen h-20"></div>
        <CreateEvent/>
    </div>
}

export default MainPage;