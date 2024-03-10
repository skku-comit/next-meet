import { NextMeetEvent } from "@/template/Event";
import { ReactNode } from "react";
import EventBlock from "./EventBlock";
import { language } from '../lib/recoil/language';
import { useRecoilState } from "recoil";

// const dummyEventList: NextMeetEvent[] = [
//   {
//     eventName: "회의 1",
//     description: "example event",
//     eventID: 12345,
//     timeInfo:{
//       isWeekly: true,
//       startTime: "12:30",
//       endTime: "15:00",
//       dateList:[],
//     },
//     participateStatus: [],
//     fixedMeeting: [],
//     hostUserInfo: {
//       userName: "name",
//       userID: 1234,
//       password: "1234",
//     },
//   },
//   {
//     eventName: "모임 1",
//     description: "example event",
//     eventID: 12345,
//     timeInfo:{
//       isWeekly: false,
//       startTime: "12:30",
//       endTime: "18:00",
//       dateList:[],
//     },
//     participateStatus: [],
//     fixedMeeting: [{ date: new Date(), timeRange: ["12:30"] }],
//     hostUserInfo: {
//       userName: "name",
//       userID: 1234,
//       password: "1234",
//     },
//   },
//   {
//     eventName: "모임 2",
//     description: "example event",
//     eventID: 12345,
//     timeInfo:{
//       isWeekly: true,
//       startTime: "12:30",
//       endTime: "15:00",
//       dateList:[],
//     },
//     participateStatus: [],
//     fixedMeeting: [],
//     hostUserInfo: {
//       userName: "name",
//       userID: 1234,
//       password: "1234",
//     },
//   },
// ];

type EventListProps = {
  eventList : NextMeetEvent[];
}
const EventList = ({eventList}:EventListProps): ReactNode => {

    const [lang, setLang] = useRecoilState(language);

    console.log('eventList:',eventList);
    const onGoingEvents = eventList
      .filter((item) => item.fixedMeeting.length === 0)
      .map((item, idx) => (
        <EventBlock event={item} key={idx} />
      ));

    const terminatedEvents = eventList
    .filter((item) => item.fixedMeeting.length !== 0)
    .map((item, idx) => (
      <EventBlock event={item} key={idx} />
    ));
  
    return (
    <div className="w-screen flex justify-center">
      <div className="(eventlist container) w-full lg:mx-20 mx-10 p-5 h-fit bg-slate-100 rounded-2xl">
        <p className="text-xl">{lang=="ko"?"진행중인 이벤트":"Events in Progress"}</p>
        <div className="p-2 py-4 grid lg:grid-cols-4 gap-6">
          {onGoingEvents}
        </div>
        <p className="text-xl mt-8">{lang=="ko"?"종료된 이벤트":"Ended Events"}</p>
        <div className="p-2 py-4 grid lg:grid-cols-4 gap-6">
          {terminatedEvents}
        </div>
      </div>
    </div>
  );
};

export default EventList;
