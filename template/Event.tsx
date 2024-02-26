import { Participate } from "./Participate";
import { TimeInfo } from "./TimeInfo";
import { User } from "./User";
import { FixedDate, WeeklyFixedDate } from "./WeeklyFixedDate";

export type NextMeetEvent = {
    eventName:              string;
    description:            string;
    eventID:                number;
    timeInfo:               TimeInfo;
    participateStatus:      Participate[];
    fixedMeeting:           FixedDate[] | WeeklyFixedDate[];
    hostUserInfo:           User; // Both member and non-member
}