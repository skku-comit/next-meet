import { Event_t } from "@/template/Event";
import { ReactNode } from "react";

const dummyEventList: Event_t[] = [
  {
    eventID: "event1",
    eventName: "event1",
    fixedDate: new Date(),
    host: {
      userId: "abc",
    },
  },
];

const EventList = (): ReactNode => {
  return <div className="w-screen">
    <div className=""></div>
  </div>;
};

export default EventList;
