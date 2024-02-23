import Setter from "@/components/Setter";
import ScheduleTableSelecto from "@/components/scheduleTableSelecto";
import ScheduleTableSelectoEdit from "@/components/scheduleTableSelectoEdit";
import eventIdCSS from "@/styles/eventId.module.css";
import ScheduleResultBottom from "@/components/ScheduleResultBottom";
import ScheduleResultRight from "@/components/ScheduleResultRight";
import ScheduleTableConfirm from "@/components/scheduleTableConfirm";
import ConfirmBtn from "@/components/ConfirmBtn";

import { FaList } from "react-icons/fa";

import { useState, useEffect } from "react";
import { throttle } from "lodash";

import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { NextMeetEvent } from '@/template/Event';


export const getServerSideProps = (async () => {
    // Fetch data from external API    
    try{
        const res = await fetch('api/form');
        
        if(res.ok){
            const repo: NextMeetEvent = await res.json()
            console.log(repo.eventName);
            return { props: { repo } }
        }
        else{
          console.log("Get Event Data failed.");
        }
      }catch(error){
        console.log(error);
      }
    
      return;
    // Pass data to the page via props
  }) 
// })satisfies GetServerSideProps<{ repo: NextMeetEvent }>

const EventPage = ({repo}: InferGetServerSidePropsType<typeof getServerSideProps>)=>{
    const [isLogin, setIsLogin] = useState(false);
    const [schedule, setSchedule]:[{schedule :[]}, Function] = useState({schedule :[]})
    const [fixedSchedule, setFixedSchedule]:[{schedule :[]}, Function] = useState({schedule :[]})
    const [commitFixedSchedule, setCommitFixedSchedule]:[{schedule :[]}, Function] = useState({schedule :[]})

    const [totalScheduleList, setTotalScheduleList]:[{checked_num: {[key: string]: number;}, member:{[key:string]:string[]}}, Function] = useState({checked_num: {}, member:{}})
    const [name, setName] = useState("");
    const [showMember, setShowMember]:[[], Function] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [totalMem, setTotalMem] = useState(4);

    const [confirm, setConfirm] = useState(0);
    const [select, setSelect] = useState(0);

    const [width, setWidth]:[number, Function] = useState(0);
    const [week, setWeek]:[boolean, Function] = useState(true);

    const [scheduleTable, setScheduleTable] = useState(true);

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
        {!select || confirm==1 ? <Setter width={width} isLogin={isLogin} setIsLogin={setIsLogin} name={name} setName={setName} setTotalMem={setTotalMem} totalMem={totalMem} confirm={confirm} setConfirm={setConfirm} select={select} scheduleTable={scheduleTable} setScheduleTable={setScheduleTable}/>:<div className="pt-10 pb-5"></div>}
        <div className={`w-screen pt-5 ${width < 768 ? "px-10":"px-20"} pb-5`}>
            <div className={`flex ${width < 768 ? "flex-col" : "flex-row"} flex-nowrap items-start text-center gap-4 justify-center`}> 
                {confirm == 1 ? <ScheduleTableConfirm week={week} isLogin={isLogin} width={width} fixedSchedule={fixedSchedule} setFixedSchedule={setFixedSchedule} scheduleTable={scheduleTable} setScheduleTable={setScheduleTable} fixedDate={null} fixedDay={null} fixedTime={null}/> : ""}
                {isLogin? <ScheduleTableSelectoEdit week={week} isLogin={isLogin} schedule={schedule} width={width} setSchedule={setSchedule} confirm={confirm} scheduleTable={scheduleTable} setScheduleTable={setScheduleTable} fixedDate={null} fixedDay={null} fixedTime={null}/> : ""}
                <ScheduleTableSelecto isLogin={isLogin} schedule={schedule} name={name} showMember={showMember}
                setShowMember={setShowMember} setShowResult={setShowResult}
                setTotalScheduleList={setTotalScheduleList} totalMem={totalMem}
                fixedSchedule={fixedSchedule} week={week}
                commitFixedSchedule={commitFixedSchedule} select={select} width={width}
                scheduleTable={scheduleTable} setScheduleTable={setScheduleTable} fixedDate={null} fixedDay={null} fixedTime={null}/>
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
            width <= 768 || isLogin || confirm == 1 ? 
            <div className={`z-30 w-full fixed bottom-0 border-gray border-t-2`}>
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