import Setter from "@/components/Setter";
import ScheduleTableSelecto from "@/components/scheduleTableSelecto";
import ScheduleTableSelectoEdit from "@/components/scheduleTableSelectoEdit";
import ScheduleResultBottom from "@/components/ScheduleResultBottom";
import ScheduleResultRight from "@/components/ScheduleResultRight";
import ScheduleTableConfirm from "@/components/scheduleTableConfirm";
import ConfirmBtn from "@/components/ConfirmBtn";
import scheResultBotCSS from "@/styles/scheduleResultBottom.module.css";
import { FaList, FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useState, useEffect,  MouseEventHandler } from "react";
import { throttle } from "lodash";
import type { InferGetServerSidePropsType } from "next";
import { NextMeetEvent } from "@/template/Event";
import { useRecoilState } from "recoil";
import { Participate } from "@/template/Participate";
import { useSession } from "next-auth/react";
import { User } from "@/template/User";
import { FixedDate, WeeklyFixedDate } from "@/template/WeeklyFixedDate";
import { language } from "@/lib/recoil/language";
import { DaysOfWeek } from "@/template/DaysOfWeek";
import { FaLink } from "react-icons/fa";
import { className_button } from "@/styles/button";
import { copyURL } from "@/lib/functions/copyURL";
import CopiedAlert from "@/components/CopiedAlert";
import { checkEnvironment } from "@/lib/functions/checkEnv";
const NEXTAUTH_URL = checkEnvironment();

export const getServerSideProps = async (context: any) => {
  // Fetch data from external API
  try {
    const { id } = context.params;
    console.log(id);
    const res = await fetch(`${NEXTAUTH_URL}/api/event?id=${id}`, {
      method: "GET",
    });

    if (res.ok) {
      const data: { event: NextMeetEvent } = await res.json();
      console.log("data", data);
      console.log("eventName", data.event.eventName);
      return { props: { event: data.event } };
    } else {
      console.log("Get Event Data failed.");
      return {
        redirect: {
          // destination: "/404",
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.log("event data", error);
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
}

const EventPage = ({
  event,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  console.log("event", event);
  //language
  const [lang, setLang] = useRecoilState(language);

  //useSession
  const { data: session } = useSession();
  console.log("session", session);

  //values
  let eventParticipate: Participate[] | null = null;
  let eventParticiTime: { schedule: Date[] } = { schedule: [] };
  let fixedMeeting: { schedule: Date[] } = { schedule: [] };
  const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekDaySorter: { [index: string]: number } = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
  };

  //useState
  const [showCopyMessage,setShowCopyMessage] = useState<boolean>(false);
  const [showDescription, setShowDescription] = useState(false);
  const [nonMemLogin, setNonMemLogin] = useState(false);
  const [loginNonMem, setLoginNonMem]: [User | undefined, Function] = useState();
  const [isLogin, setIsLogin] = useState( nonMemLogin || (session && session.user) ? true : false);
  const [isHost, setIsHost] = useState(
    session && session.user
      ? session.user.userID == event.hostUserInfo.userID
      : loginNonMem?.userID == event.hostUserInfo.userID
  );
  const [week, setWeek]: [boolean, Function] = useState(
    event?.timeInfo.isWeekly == undefined ? false : event.timeInfo.isWeekly
  );

  const sortedSelectedWeekDay = event
    ? (event.timeInfo.dayList as DaysOfWeek[]).sort(
        (a: string, b: string) => weekDaySorter[a] - weekDaySorter[b]
      )
    : [];
  let week_startDate: Date = new Date(0);
  if (sortedSelectedWeekDay) {
    for (let i = 0; i < 7; i++) {
      if (WEEKDAY[week_startDate.getDay()] == sortedSelectedWeekDay[0]) {
        break;
      }
      week_startDate.setDate(week_startDate.getDate() + 1);
    }
  }
  
  const [schedule, setSchedule]: [{ schedule: Date[] }, Function] =
    useState(eventParticiTime);
  const [preMySelected, setPreMySelected] = useState(schedule.schedule);
  const [wait, setWait]= useState(preMySelected.length <=0 ? true:false);  
  const [wait2, setWait2]= useState(false);  
  const [fixedSchedule, setFixedSchedule]: [{ schedule: Date[] }, Function] =
    useState(fixedMeeting);
  const [preFixedSchedule, setPreFixedSchedule]: [
    { schedule: Date[] },
    Function
  ] = useState(fixedMeeting);
  const [totalScheduleList, setTotalScheduleList]: [
    {
      checked_num: { [key: string]: number };
      member: { [key: string]: string[] };
    },
    Function
  ] = useState({ checked_num: {}, member: {} });
  const [name, setName] = useState(
    session && isLogin
      ? session.user.userName
      : loginNonMem
      ? loginNonMem.userName
      : ""
  );
  const [showMember, setShowMember]: [boolean, Function] = useState(false);
  const [showMemberList, setShowMemberList] = useState([]);
  const [showDateTime, setShowDateTime] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [totalMem, setTotalMem] = useState(
    event?.userList ? event.userList.length : 0
  );
  const [prevTotalMem, setPrevTotalMem] = useState(totalMem);

  const [confirm, setConfirm]: [number, Function] = useState(
    event?.fixedMeeting.length > 0 ? 2 : 0
  );
  const [select, setSelect] = useState(event?.fixedMeeting.length > 0 ? 1 : 0);

  const [width, setWidth]: [number, Function] = useState(0);

  const [scheduleTable, setScheduleTable] = useState(true);

  //useEffect
  useEffect(() => {
    setIsHost(
      session && session.user
        ? session.user.userID == event.hostUserInfo.userID
        : loginNonMem?.userName == event.hostUserInfo.userName && loginNonMem?.password == event.hostUserInfo.password
    );
  }, [isLogin, session?.user]);

  useEffect(() => {
    if (session && session.user) {
      eventParticipate =
        event.participateStatus.length > 0
          ? event.participateStatus.filter((participate: Participate) => {
              for (let i = 0; i < participate.user.length; i++) {
                console.log(
                  "eventParticiTime v",
                  participate.user,
                  session.user.userID
                );
                if (participate.user[i].userID == session.user.userID) {
                  return true;
                }
              }
              return false;
            })
          : null;
      eventParticiTime = {
        schedule: eventParticipate
          ? eventParticipate.map((participate: Participate) => participate.time)
          : [],
      };
      console.log("eventParticiTime", eventParticiTime, eventParticipate);
      setSchedule(eventParticiTime);
      setPreMySelected(eventParticiTime.schedule);
    }
  }, [isLogin, session]);

  useEffect(() => {
    setIsLogin(nonMemLogin || (session && session.user) ? true : false);
    // eventParticipate = event.participateStatus && event.participateStatus.length > 0 ? event.participateStatus?.filter((participate:Participate) =>{
    // const user = loginNonMem;
    //     for(let i = 0; i<participate.user.length; i++){
    //         console.log("eventParticiTime v", participate.user[i].userID, user ? user[0]?.userID : "")
    //         if(participate.user[i].userID == (loginNonMem && user && user?.length > 0 ? user[0]?.userID:null)){
    //             return true;
    //         }
    //     }
    //     return false}) : null;
    // eventParticiTime = {schedule : eventParticipate ? eventParticipate.map((participate:Participate)=>(participate.time)) : [] }
    // console.log("eventParticiTime",eventParticiTime,eventParticipate)
    // setSchedule(eventParticiTime);
    // console.log("loginNonMem", loginNonMem)
  }, [session ? session.user : nonMemLogin]);

  useEffect(() => {
    setName(
      session && isLogin
        ? session.user.userName
        : loginNonMem
        ? loginNonMem.userName
        : ""
    );
  }, [isLogin]);
  
  useEffect(()=>{
    console.log("isHost",isHost, session?.user?.userID == event.hostUserInfo.userID, fixedSchedule)
}, [isHost]);

useEffect(() => {
  if (typeof window !== "undefined") {
    setWidth(window.innerWidth);
  }
}, []);

useEffect(() => {
  window.addEventListener("resize", handleResize);
  return () => {
    // cleanup
    window.removeEventListener("resize", handleResize);
  };
}, []);

  if (week) {
    event?.fixedMeeting.map((sche) => {
      const date = new Date(week_startDate);
      for (let i = 0; i < 7; i++) {
        if (date.getDay() == weekDaySorter[(sche as WeeklyFixedDate).day]) {
          break;
        }
        date.setDate(week_startDate.getDate() + 1);
      }
      sche.timeRange.map((time: string) => {
        date.setHours(parseInt(time.split(":")[0]));
        date.setMinutes(parseInt(time.split(":")[1]));
        fixedMeeting.schedule.push(date);
      });
    });
  } else {
    event?.fixedMeeting.map((sche) => {
      const date = new Date((sche as FixedDate).date);
      sche.timeRange.map((time: string) => {
        date.setHours(parseInt(time.split(":")[0]));
        date.setMinutes(parseInt(time.split(":")[1]));
        fixedMeeting.schedule.push(date);
      });
    });
  }

  const indexOfLongestUserParti =
    event && event.participateStatus.length > 0
      ? event.participateStatus.reduce(
          (previousValue: Participate, currentValue: Participate) =>
            previousValue.user.length > currentValue.user.length
              ? previousValue
              : currentValue
        )
      : null;

  const longestUser = indexOfLongestUserParti?.user;
  // console.log("event_userList",event.userList?.length);
  // const userList:(User|NextMeetUser)[]=[];
  // useEffect(()=>{
  // if(event && event.participateStatus.length>0){
  // event.participateStatus.map((participate:Participate)=>{
  // for(let x = 0 ; x < event.participateStatus.length; x++){
  //     const participate = event.participateStatus[x];
  //     console.log("userList p",participate)
  // if(participate.user.length > 0){
  //     for(let i = 0; i<participate.user.length;i++){
  //         let diff = true;
  //         for(let j=0; j<userList.length; i++){
  //             if(userList[j].userID == participate.user[i]?.userID){
  //                 diff = false;
  //             }
  //         }
  //         if(diff){
  //             userList.push(participate.user[i]);
  //         }
  //     }
  // }
  // }
  // }
  // }, [])
  // console.log("userList",userList);

  const onURLCopy = () =>{
    copyURL(event.eventID);
  }

  const handleResize = throttle(() => {
    setWidth(window.innerWidth);
  }, 200);

  const [height, setHeight] = useState(192);

  const dragHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.currentTarget.parentElement;
    if (!target) return;

    const resize: EventListener = (e) => {
      const top =
        target.getBoundingClientRect().top +
        target.getBoundingClientRect().height;
      const bottom = (e as MouseEvent).clientY;
      const height = Math.max(150, top - bottom);
      console.log("resize", top, bottom, height, height - 123);
      target.style.height = `${height > 430 ? 430 : height}px`;
      setHeight(height > 430 ? 430 : height);
    };

    document.addEventListener("mousemove", resize);
    document.addEventListener(
      "mouseup",
      () => document.removeEventListener("mousemove", resize),
      { once: true }
    );
  };

  return (
    <div className="w-screen h-full min-h-screen pt-20 flex flex-col">
      {confirm != 3 && (!select || confirm == 1) ? "" : (
        <div className={ isHost ? `pt-10 ${confirm == 3 ? "pb-5" : "pb-10"}` : `pt-5`}></div>
      )}
      <div className={`relative lg:self-end self-center mx-20 ${confirm == 2 || confirm == 3 ? "mb-4" : "mt-6"}`}>
        <button className={`${className_button} flex items-center justify-center lg:w-72 `}
            onClick={() => {
            onURLCopy();
            setShowCopyMessage(true);
            setTimeout(()=>{
                setShowCopyMessage(false);
            },1000);
            }}>
            <FaLink className="w-6 h-6 mr-4"/>
            <p className="lg:text-lg text-sm">{ lang === 'ko' ? 'NextMeet URL 복사' : 'Copy NextMeet URL'}</p>
              </button>
            {showCopyMessage && <CopiedAlert/>}
      </div>
      <div className={`w-screen ${select ? "" : "pt-6"} ${ width < 768 ? "px-10" : "px-20"}`}>
        <div className={`rounded w-full bg-[#eee] min-h-10 p-3 text-center ${showDescription ? "" : "pb-2"}`}>
          <div className={`relative font-bold min-h-5 ${showDescription ? "pb-1" : "" } cursor-pointer`}
            onClick={() => {
              setShowDescription((prev) => !prev);
            }}>
            {event?.eventName}
            {showDescription ? 
              <FaAngleUp className={`absolute right-0 top-0.5`} />
             : <FaAngleDown className={`absolute right-0 top-0.5`} />
            }
          </div>
          {showDescription && 
            <div className="border-t-2 pt-2.5  border-gray min-h-10 text-center">
              {event?.description}
            </div>}
        </div>
      </div>
      {(select || confirm == 2 || confirm == 3) && isHost &&
        <ConfirmBtn
          week={week}
          select={select}
          setSelect={setSelect}
          confirm={confirm}
          setConfirm={setConfirm}
          fixedSchedule={fixedSchedule}
          setFixedSchedule={setFixedSchedule}
          setPreFixedSchedule={setPreFixedSchedule}
          eventID={event.eventID}
        />}
      {/* {true || !select || confirm == 1 || confirm == 3 && */}
        <Setter
          width={width}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          name={name}
          setName={setName}
          setTotalMem={setTotalMem}
          totalMem={totalMem}
          confirm={confirm}
          setConfirm={setConfirm}
          select={select}
          scheduleTable={scheduleTable}
          setScheduleTable={setScheduleTable}
          eventUsers={event?.userList}
          eventHost={event?.hostUserInfo}
          setSchedule={setSchedule}
          setIsHost={setIsHost}
          setNonMemLogin={setNonMemLogin}
          eventParti={event?.participateStatus}
          preMySelected={preMySelected}
          setPreMySelected={setPreMySelected}
          setLoginNonMem={setLoginNonMem}
          preFixedSchedule={preFixedSchedule}
        />
        {/* } */}
      <div className={`w-screen pt-5 ${width < 768 ? "px-10" : "px-20"} pb-5`}>
        <div
          className={`flex ${
            width < 768 ? "flex-col" : "flex-row"
          } flex-nowrap items-start text-center gap-4 justify-center`}>
          {confirm == 1 || confirm == 3 &&
             <ScheduleTableConfirm
              week={week}
              isLogin={isLogin}
              width={width}
              fixedSchedule={fixedSchedule}
              setFixedSchedule={setFixedSchedule}
              eventID={event.eventID}
              select={select}
              totalMem={totalMem}
              prevTotalMem={prevTotalMem}
              setPrevTotalMem={setPrevTotalMem}
              schedule={schedule}
              setShowMember={setShowMember}
              setShowMemberList={setShowMemberList}
              setShowDateTime={setShowDateTime}
              setTotalScheduleList={setTotalScheduleList}
              confirm={confirm}
              name={name}
              eventTimeInfo={event?.timeInfo}
              eventParti={event?.participateStatus}
              nonMemLogin={nonMemLogin}
              loginNonMem={loginNonMem}
              isHost={isHost}
              week_startDate={week_startDate}
              preMySelected={preMySelected}
              setPreMySelected={setPreMySelected}
              wait={wait}
              setWait2={setWait2}
            />
            
          }
          {isLogin && confirm == 0 &&
            <ScheduleTableSelectoEdit
              week={week}
              isLogin={isLogin}
              schedule={schedule}
              width={width}
              setSchedule={setSchedule}
              confirm={confirm}
              name={name}
              setShowMember={setShowMember}
              setShowMemberList={setShowMemberList}
              setShowDateTime={setShowDateTime}
              select={select}
              fixedSchedule={fixedSchedule}
              eventID={event.eventID}
              setTotalScheduleList={setTotalScheduleList}
              totalMem={totalMem}
              prevTotalMem={prevTotalMem}
              setPrevTotalMem={setPrevTotalMem}
              eventTimeInfo={event?.timeInfo}
              eventParti={event?.participateStatus}
              nonMemLogin={nonMemLogin}
              loginNonMem={loginNonMem}
              isHost={isHost}
              week_startDate={week_startDate}
              preMySelected={preMySelected}
              setPreMySelected={setPreMySelected}
              setTotalMem={setTotalMem}
              wait={wait}
              setWait={setWait}
              setWait2={setWait2}
            />}

          <ScheduleTableSelecto
            isLogin={isLogin}
            schedule={schedule}
            name={name}
            setShowMember={setShowMember}
            setShowMemberList={setShowMemberList}
            setShowDateTime={setShowDateTime}
            eventID={event.eventID}
            setTotalScheduleList={setTotalScheduleList}
            totalMem={totalMem}
            prevTotalMem={prevTotalMem}
            setPrevTotalMem={setPrevTotalMem}
            fixedSchedule={fixedSchedule}
            week={week}
            confirm={confirm}
            select={select}
            width={width}
            eventTimeInfo={event?.timeInfo}
            eventParti={event?.participateStatus}
            state={undefined}
            handleChange={() => {}}
            nonMemLogin={nonMemLogin}
            loginNonMem={loginNonMem}
            isHost={isHost}
            week_startDate={week_startDate}
            preMySelected={preMySelected}
            setPreMySelected={setPreMySelected}
            wait={wait}
            setWait2={setWait2}
          />
          {width > 768 && confirm == 2 &&
            <ScheduleResultRight
              setShowResult={setShowResult}
              showResult={showResult}
              showMember={showMember}
              showMemberList={showMemberList}
              scheduleList={totalScheduleList}
              totalMem={totalMem}
              confirm={confirm}
              setConfirm={setConfirm}
              select={select}
              setSelect={setSelect}
              fixedSchedule={fixedSchedule}
              setFixedSchedule={setFixedSchedule}
              week={week}
              isLogin={isLogin}
              isHost={isHost}
              week_startDate={week_startDate}
              eventTimeInfo={event.timeInfo}
              eventID={event.eventID}
              setPreFixedSchedule={setPreFixedSchedule}
              wait2={wait2}
            />}
        </div>
      </div>
      {width > 768 && confirm == 2 ? ""
       : showResult ? (
        <div className={`z-30 w-full fixed bottom-0 h-48`}>
          <div
            className={`bg-[lightgray] h-0.5 cursor-row-resize hover:bg-[darkgray] ${scheResultBotCSS.result_bottom_border}`}
            onMouseDown={(e) => dragHandler(e)}
          ></div>
          <ScheduleResultBottom
            setShowResult={setShowResult}
            showResult={showResult}
            width={width}
            schedule={schedule}
            eventID={event.eventID}
            showMember={showMember}
            showMemberList={showMemberList}
            scheduleList={totalScheduleList}
            totalMem={totalMem}
            showDateTime={showDateTime}
            confirm={confirm}
            setConfirm={setConfirm}
            select={select}
            setSelect={setSelect}
            fixedSchedule={fixedSchedule}
            setFixedSchedule={setFixedSchedule}
            week={week}
            isLogin={isLogin}
            isHost={isHost}
            eventTimeInfo={event.timeInfo}
            week_startDate={week_startDate}
            setPreFixedSchedule={setPreFixedSchedule}
            height={height}
            wait2={wait2}
          />
        </div>
      ) : (
        <div
          className="z-30 fixed bottom-5 right-5 rounded-full bg-[#eee] h-fit p-4 cursor-pointer"
          style={{ height: "52px" }}
          onClick={() => setShowResult(true)}>
          <FaList className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export default EventPage;
