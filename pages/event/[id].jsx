import Setter from "@/components/Setter";
import ScheduleTableSelecto from "@/components/ScheduleTableSelecto";
import ScheduleTableSelectoEdit from "@/components/ScheduleTableSelectoEdit";
import ScheduleResult from "@/components/ScheduleResult";

import { useState, useEffect } from "react";

const EventPage = ()=>{
    const [isLogin, setIsLogin] = useState(false);
    const [schedule, setSchedule] = useState({schedule :[]})
    const [totalScheduleList, setTotalScheduleList] = useState({})
    const [name, setName] = useState("");
    const [showMember, setShowMember] = useState([]);
    const [showResult, setShowResult] = useState(0);
    const [totalMem, setTotalMem] = useState(4);

    console.log(totalScheduleList);

    return <div className="w-screen h-full min-h-screen ">
        <div className="(header space) w-screen h-20"></div>
        <Setter isLogin={isLogin} setIsLogin={setIsLogin} setName={setName} setTotalMem={setTotalMem} totalMem={totalMem}/>
        <div className="w-screen pt-5 px-20 pb-5">
            <div className="flex flex-row flex-nowrap items-center text-center gap-4 justify-center"> 
                {isLogin? <ScheduleTableSelectoEdit isLogin={isLogin} schedule={schedule} setSchedule={setSchedule} /> : ""}
                <ScheduleTableSelecto isLogin={isLogin} schedule={schedule} name={name} setShowMember={setShowMember} setShowResult={setShowResult} setTotalScheduleList={setTotalScheduleList} totalMem={totalMem}/>
            </div>
        </div>
        <div className="w-full fixed bottom-0 border-gray border-t-2">
            <ScheduleResult showResult={showResult} showMember={showMember} scheduleList={totalScheduleList} totalMem={totalMem}/>
        </div>
    </div>
}

export default EventPage;