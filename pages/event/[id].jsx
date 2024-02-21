import Setter from "@/components/Setter";
import ScheduleTableSelecto from "@/components/ScheduleTableSelecto";
import ScheduleTableSelectoEdit from "@/components/ScheduleTableSelectoEdit";
import eventIdCSS from "@/styles/eventId.module.css";
import ScheduleResultBottom from "@/components/ScheduleResultBottom";
import ScheduleResultRight from "@/components/ScheduleResultRight";
import ScheduleTableConfirm from "@/components/ScheduleTableConfirm";
import ConfirmBtn from "@/components/ConfirmBtn";

import { FaList } from "react-icons/fa";

import { useState, useEffect } from "react";
import { throttle } from "lodash";

const EventPage = ()=>{
    const [isLogin, setIsLogin] = useState(false);
    const [schedule, setSchedule] = useState({schedule :[]})
    const [fixedSchedule, setFixedSchedule] = useState({schedule :[]})
    const [commitFixedSchedule, setCommitFixedSchedule] = useState({schedule :[]})

    const [totalScheduleList, setTotalScheduleList] = useState({})
    const [name, setName] = useState("");
    const [showMember, setShowMember] = useState([]);
    const [showResult, setShowResult] = useState(true);
    const [totalMem, setTotalMem] = useState(4);

    const [confirm, setConfirm] = useState(0);
    const [select, setSelect] = useState(0);

    const [width, setWidth] = useState();
    const [week, setWeek] = useState(true);

    useEffect(()=>{
        if(typeof window !== "undefined"){
            setWidth(window.innerWidth);
        }
    }, [])

    // const handleResize = () => {
    //     setWidth(window.innerWidth);
    // };

    const handleResize = throttle(() => {
        setWidth(window.innerWidth);
    }, 200);

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            // cleanup
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(()=>{
        console.log(fixedSchedule)
    }, [fixedSchedule])

    // console.log(commitFixedSchedule);

    return <div className="w-screen h-full min-h-screen ">
        <div className="(header space) w-screen h-20 bg-[white]"></div>
        {select ? <ConfirmBtn select={select} setSelect={setSelect} confirm={confirm} setConfirm={setConfirm} fixedSchedule={fixedSchedule} setFixedSchedule={setFixedSchedule}/> : ""}
        {!select || confirm==1 ? <Setter isLogin={isLogin} setIsLogin={setIsLogin} name={name} setName={setName} setTotalMem={setTotalMem} totalMem={totalMem} confirm={confirm} setConfirm={setConfirm} select={select}/>:<div className="pt-10 pb-5"></div>}
        <div className="w-screen pt-5 px-20 pb-5">
            <div className="flex flex-row flex-nowrap items-center text-center gap-4 justify-center"> 
                {confirm == 1 ? <ScheduleTableConfirm week={week} isLogin={isLogin} fixedSchedule={fixedSchedule} setFixedSchedule={setFixedSchedule}/> : ""}
                {isLogin? <ScheduleTableSelectoEdit week={week} isLogin={isLogin} schedule={schedule} setSchedule={setSchedule} confirm={confirm}/> : ""}
                <ScheduleTableSelecto isLogin={isLogin} schedule={schedule} name={name} 
                    setShowMember={setShowMember} setShowResult={setShowResult} 
                    setTotalScheduleList={setTotalScheduleList} totalMem={totalMem}
                    fixedSchedule={fixedSchedule} week={week}
                    commitFixedSchedule={commitFixedSchedule} select={select}/>
                {!isLogin && width > 768 && confirm != 1?
                <ScheduleResultRight setShowResult={setShowResult} showResult={showResult} 
                showMember={showMember} scheduleList={totalScheduleList} totalMem={totalMem}
                confirm={confirm} setConfirm={setConfirm} select={select} setSelect={setSelect}
                fixedSchedule={fixedSchedule} setFixedSchedule={setFixedSchedule} week={week} isLogin={isLogin}
                />
                :"" }
            </div>
        </div>
        {showResult ?
            width <= 768 | isLogin | confirm == 1 ? 
            <div className={`w-full fixed bottom-0 border-gray border-t-2`}>
                <ScheduleResultBottom 
                setShowResult={setShowResult} showResult={showResult} 
                showMember={showMember} scheduleList={totalScheduleList} totalMem={totalMem}
                confirm={confirm} setConfirm={setConfirm} select={select} setSelect={setSelect}
                fixedSchedule={fixedSchedule} setFixedSchedule={setFixedSchedule} week={week} isLogin={isLogin}
                />
            </div> :
            ""
        : <div className="fixed bottom-2.5 right-2 rounded-full bg-[#eee] w-fit p-4 cursor-pointer">
            <FaList className="w-5 h-5"
                onClick={()=>setShowResult(true)}/>
        </div>}
    </div>
}

export default EventPage;