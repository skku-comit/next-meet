import { DaysOfWeek } from "./DaysOfWeek";
import { NextMeetUser } from "./User";
import { WeeklyFixedDate } from "./WeeklyFixedDate";

export type NextMeetEvent = {
    eventName:string;
    description:string;
    eventID:string;
    startTime:string;
    endTime:string;
    participateStatus:null;
    fixedDate:Date[]|WeeklyFixedDate[];
    hostUser?:NextMeetUser; //made by member
    hostName?:string; //made by non-member
    hostPW?:string;
}