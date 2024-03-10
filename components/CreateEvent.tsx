import { ReactNode, useEffect, useRef, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import CalendarInput from "./CalendarInput";
import TimeInput from "./TimeInput";
import { className_button } from "@/styles/button";
import { DateSelection } from "@/template/DateSelection";
import { DaysOfWeek } from "@/template/DaysOfWeek";
import { createEvent } from "@/lib/functions/CRUD";
import { useSession } from "next-auth/react";
import { TimeInfo } from "@/template/TimeInfo";
import { NextMeetUser, User } from "@/template/User";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { language } from '../lib/recoil/language';


const CreateEvent = (): ReactNode => {

  const lang = useRecoilValue(language);

  //useRouter
  const router = useRouter();
  //useSession
  const { data: session } = useSession();
  //useState
  const [isCreatingEvent, setIsCreatingEvent] = useState<boolean>(false);
  const [dateSelection, setDateSelection] = useState<DateSelection>({
    isWeekly: false,
    dateList: [],
  });
  const [startTime, setStartTime] = useState<string | "">("00:00");
  const [endTime, setEndTime] = useState<string | "">("00:00");
  const [canProceed, setCanProceed] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  //useRefs
  const eventNameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const hostNameRef = useRef<HTMLInputElement>(null);
  const hostPWRef = useRef<HTMLInputElement>(null);

  //functions
  const onProceed = async () => {
    const eventName = eventNameRef.current!.value;
    const description = descriptionRef.current!.value;
    let hostUserInfo: User;
    if (session && session.user) {
      console.log(session.user)
      hostUserInfo = {
        userName: (session.user as NextMeetUser).userName,
        userID: (session.user as NextMeetUser).userID,
        password: '',
      };
    } else {
      hostUserInfo = {
        userName: hostNameRef.current!.value,
        userID: 0, //dummy
        password: hostPWRef.current!.value,
      };
    }
    const timeInfo: TimeInfo = {
      isWeekly: dateSelection.isWeekly,
      startTime: startTime,
      endTime: endTime,
      dateList:dateSelection.isWeekly ? []: dateSelection.dateList,
      dayList:dateSelection.isWeekly ? dateSelection.dateList:[]
    };

    const eventID = await createEvent(
      eventName,
      description,
      timeInfo,
      hostUserInfo,
    );
    router.push(`/event/${eventID}`);
  };

  const dateClickHandler = (value: Date | DaysOfWeek) => {
    console.log('date Click Handler')
    if (dateSelection.isWeekly === true) {
      //week mode
      if (value instanceof Date)
        setDateSelection({ isWeekly: false, dateList: [ value ] });
      else {
        if (dateSelection.dateList.includes(value) === false) {
          console.log('new Date input');
          setDateSelection((prev) => ({
            isWeekly: true,
            dateList: [...(prev.dateList as DaysOfWeek[]), value],
          })); // add new date
        } else {
          console.log('existing Date input');
          setDateSelection((prev) => ({
            isWeekly: true,
            dateList: (prev.dateList as DaysOfWeek[]).filter(
              (date) => date !== value
            ),
          })); // remove date
        }
      }
    } else {
      //specific days mode
      if (value instanceof Date) {
        if (
          dateSelection.dateList.find(date => date.getTime() === value.getTime()) === undefined) {
          console.log('add Date input');
          setDateSelection(prev => ({
            isWeekly: false,
            dateList: [...(prev.dateList as Date[]), value],
          })); // add new date
        } else {
          console.log('delete Date input');
          setDateSelection(prev => ({
            isWeekly: false,
            dateList: (prev.dateList as Date[]).filter(
              (date) => date.getTime() !== value.getTime()
            ),
          })); // remove date
        }
      } else setDateSelection({ isWeekly: true, dateList: [value] });
    }
  };

  const onToggleDateMode = (isWeekly: boolean) => {
    isWeekly
      ? setDateSelection({ isWeekly: true, dateList: [] })
      : setDateSelection({ isWeekly: false, dateList: [] });
  };

  const proceedCheck = () => {
    if (!eventNameRef.current || !descriptionRef.current) return;

    //check session
    if (session && session.user) {
    } else if (
      hostNameRef.current!.value.trim().length > 2 &&
      hostPWRef.current!.value.trim().length > 4
    ) {
    } else {
      setCanProceed(false);
      return;
    }

    //check date selection
    console.log(dateSelection.dateList);
    if (dateSelection.dateList.length === 0) {
      setCanProceed(false);
      return;
    }

    //check eventName
    if (eventNameRef.current.value.trim().length > 0) setCanProceed(true);
    else setCanProceed(false);
  };

  const onStartTimeChange = (startTime: string) => {
    setStartTime(startTime);
  };

  const onEndTimeChange = (endTime: string) => {
    setEndTime(endTime);
  };

  useEffect(()=>{
    console.log('proceedCheck');
    proceedCheck();
  },[eventNameRef.current?.value,
    hostNameRef.current?.value,
    hostPWRef.current?.value,
    dateSelection.dateList,
    session,session?.user]);

    useEffect(()=>{
      console.log(eventNameRef.current?.value);
    },[eventNameRef.current?.value]);

  return (
    <div className="w-screen h-max mb-40 flex flex-col items-center">
      {!isCreatingEvent && (
        <button
          className={`(New Event Button) ${className_button} mt-60 text-2xl flex items-center`}
          onClick={(e) => {
            e.preventDefault();
            setIsCreatingEvent(true);
          }}
        >
          <IoMdAddCircleOutline className="mr-2 w-8 h-8"/>{lang=="ko" ? "새 이벤트 만들기" : "Create New Event"}
        </button>
      )}

      {isCreatingEvent && (
        <div className="w-screen mt-10 flex flex-col items-center">
          <form className="w-[70%] flex flex-col mb-12 items-center">
            <label className="text-2xl font-bold py-4">{lang==='ko' ? '이벤트 이름' : 'Event title'}</label>
            <input
              type="text"
              className="w-full h-12 p-2 text-xl border-2 border-solid border-black rounded-md"
              ref={eventNameRef}
              onChange={proceedCheck}
            />
            <p className="m-2 text-red-400 text-sm">
              {lang==='ko' ? '*이벤트 이름은 필수 항목입니다.' : '*This field must be filled.'}
            </p>
            <label className="text-xl font-bold py-4">{lang==='ko' ? '이벤트 설명' : 'Event description'}</label>
            <textarea
              className="w-full h-20 p-2 resize-none border-2 border-solid border-black rounded-md"
              ref={descriptionRef}
            />
          </form>
          <CalendarInput
            onToggleDateMode={onToggleDateMode}
            onClickDate={dateClickHandler}
            selectedDates={dateSelection}
          />
          <TimeInput
            onStartTimeChange={onStartTimeChange}
            onEndTimeChange={onEndTimeChange}
          />
          {!(session && session.user) && (
            <>
              <p className="mt-16 text-2xl">{lang==='ko' ? '아직 회원이 아니신가요?' : 'Not our member yet?'}</p>
              <form className="m-8 mb-24 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <label className="w-32 text-center">
                    호스트 이름
                    <br />
                    Host Name
                  </label>
                  <input
                    className="border-[1px] py-1 indent-2 indent outline-none rounded-md"
                    type="text"
                    ref={hostNameRef}
                  ></input>
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-32 text-center">
                    비밀번호
                    <br />
                    PW
                  </label>
                  <input
                    className="border-[1px] py-1 indent-2 outline-none rounded-md"
                    type="password"
                    ref={hostPWRef}
                    placeholder="6자리 이상 입력해주세요"
                  ></input>
                </div>
              </form>
            </>
          )}

          <button className={`${className_button} text-xl mb-10 ${!canProceed && "bg-gray-300 cursor-auto"}`}
            onClick={onProceed}
            disabled={!canProceed}>
            {lang === 'ko' ? '이벤트 생성하기' : 'Create Event'}
          </button>
        </div>
      )}
    </div>
  );
};
export default CreateEvent;
