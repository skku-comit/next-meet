import { DaysOfWeek } from "./DaysOfWeek";
import { User } from "./User";
import { FixedDate, WeeklyFixedDate } from "./WeeklyFixedDate";

export type NextMeetEvent = {
    eventName:              string;
    description:            string;
    eventID:                number;
    startTime:              string;
    endTime:                string;
    participateStatus:      null;
    candidates:             DaysOfWeek[] | Date[];
    meetingTable:           number[][];
    fixedMeeting:           FixedDate[] | WeeklyFixedDate[];
    hostUserInfo:           User; // Both member and non-member
    //hostName?:              string; //made by non-member
    //hostPW?:                string;
}