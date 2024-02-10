import Setter from "@/components/Setter";
import ScheduleTable from "@/components/ScheduleTable";
import ScheduleTableEdit from "@/components/ScheduleTableEdit";

import { useState, useEffect } from "react";

const EventPage = ()=>{
    const [isLogin, setIsLogin] = useState(false);
    

    return <div className="w-screen h-full min-h-screen ">
        <div className="(header space) w-screen h-20"></div>
        <Setter isLogin={isLogin} setIsLogin={setIsLogin}/>
        <div className="w-screen pt-5 px-20">
            <div className="flex flex-row flex-nowrap items-center text-center gap-2 justify-center"> 
                {isLogin? <ScheduleTableEdit /> : ""}
                <ScheduleTable />
            </div>
        </div>
    </div>
}

export default EventPage;