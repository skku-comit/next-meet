import { Participate } from "./Participate";
import { User } from "./User";
import { FixedDate, WeeklyFixedDate } from "./WeeklyFixedDate";

export type NextMeetEvent = {
    eventName:              string;
    description:            string;
    eventID:                number;
    startTime:              string;
    endTime:                string;
    participateStatus:      Participate[];
    fixedMeeting:           FixedDate[] | WeeklyFixedDate[];
    hostUserInfo:           User; // Both member and non-member
}